import { useState, useEffect } from "react";

const searchBank = ({ headOfficeList }) => {
  console.log(headOfficeList);
  const [selectedHeadOffice, setSelectedHeadOffice] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectOption = (headOffice) => {
    setSelectedHeadOffice(`${headOffice.code} ${headOffice.bankName}`);
  };

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
                onChange={(e) => setSelectedHeadOffice(e.target.value)}
              />
            </div>
            <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
              <li className="w-full rounded bg-gray-50 text-center py-2"></li>
              {headOfficeList.map((headOffice) => {
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
          </div>
          <div className="text-gray-500 text-sm">
            可使用下拉選單或直接輸入關鍵字查詢
          </div>
        </section>
        <section>
          <label htmlFor="branchName">分行名稱</label>
          <div className="relative w-[10rem]">
            <button
              className="flex w-full items-center justify-between rounded bg-white p-2 ring-1 ring-gray-300"
              id="branchName"
            ></button>
            <ul className="z-2 absolute mt-1 w-full rounded bg-gray-50 ring-1 ring-gray-300 max-h-60 overflow-y-auto">
              <li className="cursor-pointer p-2 hover:bg-gray-200"></li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
};
export default searchBank;
