import { useState, useEffect } from "react";

const searchBank = ({ headOfficeList, processedBankList, onSelectedBank }) => {
  // console.log(headOfficeList);
  const [selectedHeadOffice, setSelectedHeadOffice] = useState("");
  const [selectedBranch, setSelectedBranch] = useState({});
  const [isOpenHeadOffice, setIsOpenHeadOffice] = useState(false);
  const [isOpenBranch, setIsOpenBranch] = useState(false);
  const [filterHeadOffice, setFilterHeadOffice] = useState([]);
  const [filterBranches, setFilterBranches] = useState([]);

  const handleSelectOption = (headOffice) => {
    setSelectedHeadOffice(`${headOffice.code} ${headOffice.bankName}`);
    setIsOpenHeadOffice(false);
  };
  useEffect(() => {
    setFilterHeadOffice(headOfficeList);
  }, [headOfficeList]);
  const handleHeadOfficeList = () => {
    setIsOpenHeadOffice(!isOpenHeadOffice);
  };

  const handleSelectBrnanch = (branch) => {
    console.log(branch);

    setSelectedBranch({
      branch: branch.branchOffice,
      branchCode: branch.branchCode,
    });
    setIsOpenBranch(false);
  };
  const handleBranchList = () => {
    setIsOpenBranch(!isOpenBranch);
  };

  const handleInputHeadOffice = (e) => {
    const keyword = e.target.value;
    const normalize = keyword.trim().toLowerCase();

    setSelectedHeadOffice(keyword);
    const next = headOfficeList.filter((headOffice) => {
      return (
        headOffice.bankName.includes(normalize) ||
        headOffice.code.includes(normalize)
      );
    });
    setFilterHeadOffice(next);
    setIsOpenHeadOffice(true);
  };

  const handleFilterBranch = () => {
    const headOfficeName = selectedHeadOffice.split(" ")[1];
    // console.log(headOfficeName);
    const branches = processedBankList.filter((bank) => {
      return bank.headOffice === headOfficeName;
    });
    return branches;
  };
  useEffect(() => {
    if (selectedHeadOffice) {
      setFilterBranches(handleFilterBranch);
      setIsOpenBranch(true);
    }
    console.log(filterBranches);
  }, [selectedHeadOffice]);

  const handleSelectedBranch = () => {
    setSelectedBranch(selectedBranch);
    setIsOpenBranch(false);
  };
  useEffect(() => {
    if (selectedBranch) {
      handleSelectedBranch;
    }
    console.log(selectedBranch);
  }, [selectedBranch]);

  const handleSelectedBankData = (selectedBank, selectedBranch) => {
    const headOfficeCode = selectedBank.split(" ")[0];
    const headOfficeName = selectedBank.split(" ")[1];
    onSelectedBank({
      headOffice: headOfficeName,
      headOfficeCode: headOfficeCode,
      branch: selectedBranch,
    });
  };
  useEffect(() => {
    if (selectedHeadOffice && selectedBranch) {
      handleSelectedBankData(selectedHeadOffice, selectedBranch);
    }
  }, [selectedBranch]);
  return (
    <>
      <div className="flex justify-center my-3">
        <section className="mx-2">
          <label htmlFor="bankName">銀行名稱</label>
          <div className="relative w-[16rem]">
            <div className="flex w-full items-center justify-between rounded bg-white p-2 ring-1 ring-gray-300">
              <input
                className="w-full outline-none"
                placeholder="請輸入關鍵字或銀行代碼..."
                id="bankName"
                value={selectedHeadOffice}
                onChange={(e) => handleInputHeadOffice(e)}
                onFocus={() => setIsOpenHeadOffice(true)}
              />
              <span
                className="material-symbols-outlined"
                onClick={() => handleHeadOfficeList()}
              >
                {isOpenHeadOffice ? "stat_1" : "stat_minus_1"}
              </span>
            </div>
            {isOpenHeadOffice && (
              <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
                <li className="w-full rounded bg-gray-50 text-center py-2"></li>
                {filterHeadOffice.map((headOffice) => {
                  return (
                    <li
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      key={headOffice.code}
                      onClick={() => handleSelectOption(headOffice)}
                    >
                      <span className="mr-2">{headOffice.code}</span>
                      {headOffice.bankName}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="text-gray-500 text-sm">
            可使用下拉選單或直接輸入關鍵字查詢
          </div>
        </section>
        <section>
          <label htmlFor="branchName">分行名稱</label>
          <div className="relative w-[10rem]">
            <div className="flex w-full items-center justify-between rounded bg-white p-2 ring-1 ring-gray-300">
              <input
                className="w-full outline-none"
                id="branchName"
                value={selectedBranch}
              />
              <span
                className="material-symbols-outlined"
                onClick={() => handleBranchList()}
              >
                {isOpenBranch ? "stat_1" : "stat_minus_1"}
              </span>
            </div>

            {isOpenBranch && (
              <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
                {filterBranches.map((branch) => {
                  return (
                    <li
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      key={branch.branchCode}
                      onClick={() => handleSelectBrnanch(branch)}
                    >
                      {branch.branchOffice}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default searchBank;
