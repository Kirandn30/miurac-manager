import React from "react";
import DataTable from "react-data-table-component";
import { Text, Badge, Button } from "@mantine/core";
import spacetime from "spacetime";
import { ProjectDetailsType } from "../../redux/projectSlice";
import { HitsProvided } from "react-instantsearch-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";

export const ProjectTableData = ({
  setOpened,
  hits,
}: {
  setOpened: React.Dispatch<
    React.SetStateAction<{
      modal: boolean;
      data: ProjectDetailsType | null;
    }>
  >;
  hits: any;
}) => {
  const { ProjectsDetails } = useSelector(
    (state: RootState) => state.projectdetails
  );
  const { shouldFetch } = useSelector((state: RootState) => state.Search);

  const columns = [
    {
      name: "Filed on",
      cell: (row: ProjectDetailsType) => {

        return (
          <Text className="text-xs font-medium">
            {/* 
            //@ts-ignore */}
            {spacetime(hits.length>0?new Date(row.createdAt):row.createdAt?.toDate())
              .format("nice")
              .replace(",", " -")}
          </Text>
        );
      },
    },
    {
      name: "Client Name",
      cell: (row: ProjectDetailsType) => {
        return <Text className="text-xs">{row.clientName}</Text>;
      },
    },
    {
      name: "Company",
      cell: (row: ProjectDetailsType) => {
        return <Text className="text-xs">{row.clientCompany}</Text>;
      },
    },
    {
      name: "Client Phone",
      cell: (row: ProjectDetailsType) => {
        return <Text className="text-xs">{row.clientPhone}</Text>;
      },
    },
    {
      name: "App Deliverables",
      cell: (row: ProjectDetailsType) => {
        return (
          <div>
            {row.appStructure.map((app) => (
              <Badge className="">{app}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      name: "Action",
      cell: (row: ProjectDetailsType) => {
        return (
          <div>
            <Button onClick={() => setOpened({ data: row, modal: true })}>
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  console.log(shouldFetch, hits);
  
  return (
    <div>
      {shouldFetch ? (
        <DataTable
          data={hits}
          columns={columns}
          pagination
          fixedHeader
          customStyles={customStyles}
        />
      ) : (
        <DataTable
          data={ProjectsDetails}
          columns={columns}
          pagination
          fixedHeader
          customStyles={customStyles}
        />
      )}
    </div>
  );
};

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
  rows: {
    style: {
      minHeight: "50px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      fontWeight: 900,
      fontSize: "14px",
      backgroundColor: "#e6e6e6",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};
