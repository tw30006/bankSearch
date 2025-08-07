import Header from './layout/Header';
import SearchBank from './components/SearchBank';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';

//data現在是一包大資料
//

function App() {
  const [bankData, setbankData] = useState(null);
  const [processedBankList, setProcessedBankList] = useState([]);
  const [headOfficeList, setHeadOfficeList] = useState([]);
  // const [selectedBranch, setSelectedBranch] = useState([]);

  //這裡處理csv轉json
  const getBankData = () => {
    Papa.parse('/data.csv', {
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
      const match = bank['機構名稱'].match(regex);
      return {
        headOffice: match?.[1] || '',
        branchOffice: match?.[3] || '',
        headOfficeCode: bank['總機構代號'],
        address: bank['地址'],
        tel: bank['電話'],
      };
    });
    return handleBanks;
  };

  // console.log(uniqueBankCodes);

  // const handleBranch = () => {};

  useEffect(() => {
    if (bankData) {
      const processedData = defineBankData();
      setProcessedBankList(processedData);
      const uniqueMap = new Map();
      processedData.forEach((bank) => {
        return uniqueMap.set(bank.headOfficeCode, bank.headOffice);
      });
      // console.log(uniqueMap);

      const headOfficeArr = Array.from(uniqueMap, ([code, bankName]) => ({
        code,
        bankName,
      }));
      setHeadOfficeList(headOfficeArr);
    }
  }, [bankData]);

  return (
    <>
      <Header />
      <SearchBank headOfficeList={headOfficeList} />
    </>
  );
}

export default App;
