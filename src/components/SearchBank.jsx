import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const searchBank = ({
  headOfficeList,
  processedBankList,
  onSelectedBank,
  selectedHeadOffice,
  setSelectedHeadOffice,
  selectedBranch,
  setSelectedBranch,
}) => {
  const [filterBranches, setFilterBranches] = useState([]);
  const [filteredHeadOffices, setFilteredHeadOffices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const handleSelectedHeadOffice = (headOffice) => {
    setSelectedHeadOffice(`${headOffice.code} ${headOffice.bankName}`);
    setIsDropdownOpen(false);
  };
  //初始化
  useEffect(() => {
    setFilteredHeadOffices(headOfficeList);
  }, [headOfficeList]);

  const handleHeadOfficeList = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleBranchList = () => {
    setIsBranchDropdownOpen(!isBranchDropdownOpen);
  };
  const handleSelectedBranch = (branch) => {
    setSelectedBranch((prevState) => ({
      ...prevState,
      branch: branch.branchOffice,
      branchCode: branch.branchCode,
    }));
    setIsBranchDropdownOpen(false);
  };

  //當我的input需要關鍵字時，下面的li要出現相對應的內容
  const handleInputKeyword = (e) => {
    const keyword = e.target.value;
    const normalize = keyword.trim();
    setSelectedHeadOffice(keyword);
    const next = headOfficeList.filter((headOffice) => {
      return (
        headOffice.bankName.includes(normalize) ||
        String(headOffice.code).includes(normalize)
      );
    });
    setFilteredHeadOffices(next);
    setIsDropdownOpen(true);
  };

  const handleFilterBranches = (processedBankList) => {
    const headOfficeCode = selectedHeadOffice.split(" ")[0];
    return processedBankList.filter(
      (bank) => bank.headOfficeCode === headOfficeCode
    );
  };
  useEffect(() => {
    if (selectedHeadOffice) {
      setFilterBranches(handleFilterBranches(processedBankList));
      setIsBranchDropdownOpen(true);
    }
  }, [selectedHeadOffice]);

  const handleSaveBankData = (selectedHeadOffice, selectedBranch) => {
    if (!selectedHeadOffice || !selectedBranch) return;
    const headOfficeName = selectedHeadOffice.split(" ")[1];
    const headOfficeCode = selectedHeadOffice.split(" ")[0];
    // console.log(headOfficeName, headOfficeCode, selectedBranch.branch);
    onSelectedBank({
      headOfficeName: headOfficeName,
      headOfficeCode: headOfficeCode,
      branch: selectedBranch.branch,
      branchCode: selectedBranch.branchCode,
    });
  };
  useEffect(() => {
    if (selectedBranch) {
      handleSaveBankData(selectedHeadOffice, selectedBranch);
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
                onChange={(e) => {
                  handleInputKeyword(e);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <span
                className="material-symbols-outlined"
                onClick={() => handleHeadOfficeList()}
              >
                {isDropdownOpen ? "stat_1" : "stat_minus_1"}
              </span>
            </div>
            {isDropdownOpen && (
              <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
                <li className="w-full rounded bg-gray-50 text-center py-2"></li>
                {filteredHeadOffices.map((headOffice) => {
                  return (
                    <li
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      key={headOffice.code}
                      onClick={() => handleSelectedHeadOffice(headOffice)}
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
                value={selectedBranch?.branch || ""}
                readOnly
              />
              <span
                className="material-symbols-outlined"
                onClick={() => handleBranchList()}
              >
                {isBranchDropdownOpen ? "stat_1" : "stat_minus_1"}
              </span>
            </div>

            {isBranchDropdownOpen && (
              <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
                {filterBranches.map((branch) => {
                  return (
                    <li
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      key={branch.branchOffice}
                      onClick={() => handleSelectedBranch(branch)}
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
      <Outlet />
    </>
  );
};
export default searchBank;
