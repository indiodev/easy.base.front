"use client";

import TableComponent from "@/components/Table/Table";
import { API } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

export default function Page() {
  const router = useRouter();

  const params = useParams<{ id: string }>();

  const tableId = params!.id;

  const [tableData, setTableData] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) loadTables();
  }, []);

  function loadTables() {
    setLoading(false);

    API.get("/tables/" + tableId)
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex flex-1 overflow-auto h-full flex-col gap-4">
      {tableData ? (
        <TableComponent
          reload={loadTables}
          id={tableId}
          tableData={tableData}
        />
      ) : (
        <div className="flex w-full h-full flex-1 justify-center items-center">
          <ThreeDots
            visible={true}
            height="100"
            width="100"
            color="#549eff"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
    </div>
  );
}
