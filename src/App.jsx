import Header from "./layout/Header";
import SearchBank from "./components/SearchBank";
import BankDetail from "./components/BankDetail";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

//data現在是一包大資料

function App() {
  const [bankData, setbankData] = useState(null);
  const [processedBankList, setProcessedBankList] = useState([]);
  const [headOfficeList, setHeadOfficeList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedBankDetail, setSelectedBankDetail] = useState(null);

  //這裡處理csv轉json
  const getBankData = () => {
    Papa.parse("/data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results.data);
        setbankData(() => results.data);
      },
    });
  };
  useEffect(() => {
    getBankData();
  }, []);

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
        headOffice: match?.[1] || "",
        branchOffice: match?.[3] || "",
        headOfficeCode: bank["總機構代號"],
        branchCode: bank["機構代號"],
        address: bank["地址"],
        tel: bank["電話"],
      };
    });
    return handleBanks;
  };

  // console.log(uniqueBankCodes);

  useEffect(() => {
    if (bankData) {
      const processedData = defineBankData();
      setProcessedBankList(processedData);
      const uniqueMap = new Map();
      processedData.forEach((bank) => {
        return uniqueMap.set(bank.headOfficeCode, bank.headOffice);
      });

      const headOfficeArr = Array.from(uniqueMap, ([code, bankName]) => ({
        code,
        bankName,
      }));
      setHeadOfficeList(headOfficeArr);
    }
  }, [bankData]);

  const handleSelectedBank = (bank) => {
    setSelectedBank(bank);
  };

  const handleBankDetail = (bankList, selectedBank) => {
    const bankDetail = bankList.find((bank) => {
      return (
        bank.headOffice === selectedBank.headOffice &&
        bank.branchOffice === selectedBank.branch
      );
    });
    setSelectedBankDetail(bankDetail);
  };
  useEffect(() => {
    if (selectedBank && processedBankList) {
      handleBankDetail(processedBankList, selectedBank);
    }
    console.log(selectedBank);
  }, [processedBankList, selectedBank]);

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
            />
          }
        />
        <Route
          path="/"
          element={<BankDetail bankDetail={selectedBankDetail} />}
        />
      </Routes>
      {/* <SearchBank
        headOfficeList={headOfficeList}
        processedBankList={processedBankList}
        onSelectedBank={handleSelectedBank}
      />
      <BankDetail bankDetail={selectedBankDetail} /> */}
    </>
  );
}

export default App;
