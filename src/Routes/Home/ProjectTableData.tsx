import React, { useEffect, useState } from 'react'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'
import { Text, Badge, Menu, ActionIcon, Divider } from "@mantine/core"
import spacetime from 'spacetime'
import { ProjectDetailsType } from '../../redux/projectSlice'
import { HitsProvided } from "react-instantsearch-dom"
import { collection, doc, getCountFromServer, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { IconDots, IconDownload, IconPencil, IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid';

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
    const { ProjectsDetails } = useSelector((state: RootState) => state.projectdetails)
    const { user } = useSelector((state: RootState) => state.user)

    const [totalDocs, setTotalDocs] = useState(0)

    useEffect(() => {
        (async () => {
            if (!user) return
            const docRef = collection(db, "Users", user.uid, "Projects");
            const snapshot = await getCountFromServer(docRef);
            setTotalDocs(snapshot.data().count);
        })()
    }, [])


    const columns = [
        {
            name: 'Filed on',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs font-medium'>{spacetime(row.createdAt?.toDate()).format("nice").replace(",", " -")}</Text>
                )
            }
        },
        {
            name: 'Client Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientName}
                    </Text>
                )
            }
        },
        {
            name: 'Company',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientCompany}
                    </Text>
                )
            }
        },
        {
            name: 'Project Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.projectName}
                    </Text>
                )
            }
        },
        {
            name: 'Budget Estimation',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.estimatedBudject.reduce((a, b) => a + Number(b.estdCost), 0)}
                    </Text>
                )
            }
        },
        {
            name: 'Status',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        <Badge className=''>{row.status}</Badge>
                    </div>
                )
            }
        },
        {
            name: 'Action',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <ActionIcon
                                    size="md"
                                    variant='filled'
                                >
                                    <IconDots />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={() => setOpened({ data: row, modal: true })} icon={<IconPencil size={14} />}>Edit</Menu.Item>
                                <Menu.Item icon={<IconSquareRoundedPlus size={14} />}>Add Documents</Menu.Item>
                                <Menu.Item icon={<IconDownload size={14} />}>Download</Menu.Item>
                                <Menu.Item icon={<IconTrash size={14} />}>Delete</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                )
            }
        },
    ]

    // data provides access to your row data
    const ExpandedComponent: React.FC<ExpanderComponentProps<ProjectDetailsType>> = ({ data }) => {
        return (
            <div>
                <div className='grid md:grid-cols-3 gap-y-3 p-5'>
                    <div className='space-y-3'>
                        <Text className='text-sm font-semibold'>App Structure :</Text>
                        <div className='space-x-3'>
                            {data.appStructure.map(app => (
                                <Badge>{app}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <Text className='text-sm font-semibold'>Team :</Text>
                        <div className='space-x-3 flex text-xs'>
                            {data.humanResourceRequriments.map(data => (
                                <Text >{data.name},</Text>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className='flex gap-3 text-sm'>
                            <Text className='text-sm font-semibold'>Latest Update :</Text>
                            <Text className='text-sm'>{data.latestUpdate[0].update}</Text>
                        </div>
                        <div className='flex gap-3 text-sm'>
                            <Text className='text-sm font-semibold'>Remarks :</Text>
                            <Text className='text-sm'>{data.remarks[0].remark}</Text>
                        </div>
                    </div>
                </div>
                <Divider />
            </div>
        );
    };
    console.log(totalDocs);

    return (
        <div className=''>
            <DataTable
                data={ProjectsDetails}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                selectableRows
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                paginationTotalRows={totalDocs}
                onChangePage={(a, b) => console.log(a, b)}
                paginationServer
            />
        </div>
    )
}

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
    rows: {
        style: {
            minHeight: '60px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 700,
            fontSize: "14px",
        },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
    headRow: {
        style: {
            backgroundColor: "#e6e6e6",
            minHeight: '52px',
            borderBottomWidth: '1px',
            borderBottomColor: "#e6e6e6",
            borderBottomStyle: 'solid',
            borderRadius: "10px",
            padding: "10px 0px"
        },
    },
};
