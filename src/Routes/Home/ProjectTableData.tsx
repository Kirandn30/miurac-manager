import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import DataTable from 'react-data-table-component'
import { Text, Badge, Button } from "@mantine/core"
import spacetime from 'spacetime'
import { ProjectDetailsType } from '../../redux/projectSlice'

export const ProjectTableData = ({ setOpened }: {
    setOpened: React.Dispatch<React.SetStateAction<{
        modal: boolean;
        data: ProjectDetailsType | null;
    }>>

}) => {
    const { ProjectsDetails } = useSelector((state: RootState) => state.projectdetails)
    const { CompanyDetails } = useSelector((state: RootState) => state.user)
    console.log(ProjectsDetails);

    const columns = [
        {
            name: 'Project Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs font-medium'>{row.projectName}</Text>
                )
            }
        },
        {
            name: 'Company Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientCompany}
                    </Text>
                )
            }
        },
        {
            name: 'Client Email',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientEmail}
                    </Text>
                )
            }
        },
        {
            name: 'Client Phone',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientPhone}
                    </Text>
                )
            }
        },
        {
            name: 'Created At',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {spacetime(row.createdAt.seconds * 1000).format("nice").replace(",", " -")}
                    </Text>
                )
            }
        },
        {
            name: 'App Deliverables',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        {row.appStructure.map(app => (
                            <Badge className=''>{app}</Badge>
                        ))}
                    </div>
                )
            }
        },
        {
            name: 'Action',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        <Button
                            onClick={() => setOpened({ data: row, modal: true })}
                        >Edit</Button>
                    </div>
                )
            }
        },
    ]

    return (
        <div>
            <DataTable
                data={ProjectsDetails}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
            />
        </div>
    )
}

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
    rows: {
        style: {
            minHeight: '50px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 900,
            fontSize: "14px"
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
};