import Header from "./layout/Header";
import SearchBank from "./components/SearchBank";
import BankDetail from "./components/BankDetail";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

//data現在是一包大資料

function App() {
  const [bankData, setbankData] = useState(null);
  const [processedBankList, setProcessedBankList] = useState([]);
  const [headOfficeList, setHeadOfficeList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankDetail, setBankDetail] = useState(null);
  const [selectedHeadOffice, setSelectedHeadOffice] = useState("");
  const [selectedBranch, setSelectedBranch] = useState({
    branch: "",
    branchCode: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  //這裡處理csv轉json
  const getBankData = () => {
    Papa.parse("/data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // console.log(results.data);
        setbankData(() => results.data);
      },
    });
  };
  useEffect(() => {
    getBankData();
  }, []);

  //重新處理銀行的資料
  const defineBankData = () => {
    const regex =
      /^(.+?(銀行|公司|有限公司|商業銀行|農會|信用合作社|信用部))(.+)?$/;
    const handleBanks = bankData.map((bank) => {
      const cleanedOrgName = String(bank["機構名稱"] || "").replace(
        /股份有限公司/g,
        ""
      );
      const match = cleanedOrgName.match(regex);

      return {
        headOffice: (match?.[1] || "").trim(),
        branchOffice: (match?.[3] || "").trim(),
        headOfficeCode: bank["總機構代號"],
        branchCode: bank["機構代號"],
        address: bank["地址"],
        tel: bank["電話"],
      };
    });
    return handleBanks;
  };

  useEffect(() => {
    if (bankData) {
      const processedData = defineBankData();

      setProcessedBankList(processedData);
      const uniqueMap = new Map();
      processedData.forEach((bank) => {
        return uniqueMap.set(bank.headOfficeCode, bank.headOffice);
      });

      const headOfficeArr = Array.from(uniqueMap).flatMap(([code, bankName]) =>
        bankName !== "" ? [{ code, bankName }] : []
      );
      setHeadOfficeList(headOfficeArr);
    }
  }, [bankData]);

  //當我複製網址到新的頁面時，會選染銀行的資料
  useEffect(() => {
    // 確保 processedBankList 有數據才執行
    if (location.pathname && processedBankList.length > 0) {
      const urlMatch = location.pathname.match(
        /^\/([^\/]+)\/([^\/]+)\/(.+)\.html$/
      );

      // 檢查 URL 是否匹配預期格式
      if (urlMatch) {
        const [, headOfficeCode, branchCode] = urlMatch;

        const foundBank = processedBankList.find(
          (bank) =>
            bank.headOfficeCode === headOfficeCode &&
            bank.branchCode === branchCode
        );

        // 如果找到銀行，可以設置相關狀態
        if (foundBank) {
          setSelectedBank(foundBank);
        }
      }
    }
  }, [location.pathname, processedBankList]);

  //處理被選中的銀行，從SearchBank傳值出來
  const handleSelectedBank = (bank) => {
    setSelectedBank(bank);
    if (bank) {
      const names = `${bank.headOfficeName}-${bank.branch}`;
      const url = `/${bank.headOfficeCode}/${bank.branchCode}/${names}.html`;

      navigate(url);
    }
  };

  const handleBankDetail = (processedBankList) => {
    const bankDetail = processedBankList.find(
      (bank) =>
        bank.headOfficeCode === selectedBank.headOfficeCode &&
        bank.branchCode === selectedBank.branchCode
    );
    setBankDetail(bankDetail);
  };

  useEffect(() => {
    if (selectedBank) {
      handleBankDetail(processedBankList);
    }
  }, [processedBankList, selectedBank]);

  const handleReset = () => {
    setSelectedHeadOffice("");
    setSelectedBranch({});
    navigate("/");
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("連結已複製到剪貼簿！");
      })
      .catch((err) => {
        alert("複製失敗，請手動複製URL");
      });
  };

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <SearchBank
              headOfficeList={headOfficeList}
              processedBankList={processedBankList}
              onSelectedBank={handleSelectedBank}
              onReset={handleReset}
              selectedHeadOffice={selectedHeadOffice}
              setSelectedHeadOffice={setSelectedHeadOffice}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          }
        >
          <Route
            path="/:headOfficeCode/:branchCode/:names.html"
            element={
              <BankDetail
                bankDetail={bankDetail}
                onReset={handleReset}
                onCopyUrl={handleCopyUrl}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
