import { useState, useEffect } from "react";

const searchBank = ({ headOfficeList }) => {
  console.log(headOfficeList);
  const [selectedHeadOffice, setSelectedHeadOffice] = useState("");
  const [isOpenHeadOffice, setIsOpenHeadOffice] = useState(false);
  const [filterHeadOffice, setFilterHeadOffice] = useState([]);

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
