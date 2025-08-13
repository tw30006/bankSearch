const BankDetail = ({ bankDetail }) => {
  console.log(bankDetail);
  if (!bankDetail) return;
  return (
    <>
      <div className="m-auto w-[60%] bg-sky-300/25 px-2 py-3">
        <div className="flex mb-3">
          <p className="text-3xl">{bankDetail.headOffice}</p>
          <p className="text-3xl">{bankDetail.headOfficeCode}</p>
          <p className="text-3xl">{bankDetail.branchOffice}</p>
        </div>
        <div className="flex items-center mb-3">
          <p className="text-lg me-2">分行代碼：{bankDetail.branchCode}</p>
          <button className="border border-solid border-sky-700 p-1 text-sky-700 rounded-md hover:text-white hover:bg-sky-700">
            複製代碼
          </button>
        </div>
        <p className="text-lg mb-3">地址：{bankDetail.address}</p>
        <div className="flex justify-between">
          <p className="text-lg">電話：{bankDetail.tel}</p>
          <div className="flex items-center">
            <p className="text-sm text-gray-400">資料來源：</p>
            <a
              href="https://data.gov.tw/dataset/6041"
              className="text-gray-400 text-sm flex items-end"
            >
              政府資料開放平台
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-center my-2">
        <button className=" border border-solid border-sky-700 p-2 text-sky-700 rounded-md hover:text-white hover:bg-sky-700 me-5">
          重新查詢
        </button>
        <button className=" border border-solid border-sky-700 p-2 text-sky-700 rounded-md hover:text-white hover:bg-sky-700">
          複製此頁面連結
        </button>
      </div>
    </>
  );
};

export default BankDetail;
