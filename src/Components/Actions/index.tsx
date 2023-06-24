import React, { useEffect, useRef, useState } from 'react'
import { Button, ActionIcon, TextInput, Transition } from "@mantine/core"
import { IconArrowNarrowUp, IconX } from '@tabler/icons-react'
import { IconSearch } from '@tabler/icons-react'
import { IconFilter } from '@tabler/icons-react'
import { IconPlus } from '@tabler/icons-react'
import { debounce } from 'lodash'
import { useMediaQuery } from '@mantine/hooks'
import { ProjectDetailsType } from '../../redux/projectSlice'
import {
    connectSearchBox,
} from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux'
import { setShouldFetchHits } from '../../redux/searchSlice'

export const TableHeader = ({ setOpened }: {
    setOpened: React.Dispatch<React.SetStateAction<{
        modal: boolean;
        data: ProjectDetailsType | null;
    }>>
}) => {
    // const [shouldFetchHits, setShouldFetchHits] = useState(false);
    const [searchActive, setsearchActive] = useState({ active: false, text: "" })
    const matches = useMediaQuery('(min-width: 767px)');

    const CustomSearchBox = connectSearchBox(SearchBox);

    // const handleSearch = (value: string) => {
    //     console.log(value);
    // }

    return (
        <div className='bg-white px-3 py-5 space-y-3'>
            {
                !matches ? (
                    <div>
                        <Transition mounted={searchActive.active} transition="fade" duration={400} timingFunction="ease">
                            {(styles) => (
                                <div style={styles} className='flex gap-3'>
                                    <CustomSearchBox />
                                    <Button variant='outline' onClick={() => setsearchActive({ active: false, text: "" })}>Close</Button>
                                </div>
                            )}
                        </Transition>
                        <Transition mounted={!searchActive.active} transition="pop" duration={400} exitDuration={0} timingFunction="ease">
                            {(styles) => (
                                <div style={styles} className='grid grid-cols-2'>
                                    <div className='self-center'>
                                        {/* <Button
                                            leftIcon={<IconArrowNarrowUp />}
                                            variant='outline'
                                        >
                                            Export
                                        </Button> */}
                                    </div >
                                    <div className='flex justify-end gap-3'>
                                        <ActionIcon onClick={() => setsearchActive({ active: true, text: "" })} style={{ borderRadius: "100%", padding: "3px", border: "solid 1px #e6e6e6" }} size="xl" variant='light'>
                                            <IconSearch />
                                        </ActionIcon>
                                        <ActionIcon style={{ borderRadius: "100%", padding: "3px", border: "solid 1px #e6e6e6" }} size="xl" variant='light'>
                                            <IconFilter />
                                        </ActionIcon>
                                        <ActionIcon
                                            style={{ borderRadius: "100%", padding: "3px", backgroundColor: "#003152FF" }} size="xl" variant='filled'
                                            onClick={() => setOpened(op => ({ ...op, data: null, modal: true }))}
                                        >
                                            <IconPlus />
                                        </ActionIcon>
                                    </div>
                                </div >
                            )}
                        </Transition>
                    </div>

                ) : (
                    <div className='flex justify-end gap-5'>
                        {/* <Button
                            leftIcon={<IconArrowNarrowUp />}
                            variant='outline'
                        >
                            Export
                        </Button> */}
                        <div className="flex-grow grid justify-end">
                            <CustomSearchBox />
                        </div>
                        <Button
                            leftIcon={<IconFilter />}
                            variant='subtle'
                        >
                            Filter
                        </Button>
                        <Button
                            leftIcon={<IconPlus />}
                            onClick={() => setOpened(op => ({ ...op, data: null, modal: true }))}
                        >
                            Create Project
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

interface SearchBoxProps {
    currentRefinement: string;
    refine: (value: string) => void;
    // setShouldFetchHits: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBox = ({ currentRefinement, refine }: SearchBoxProps) => {
    const dispatch = useDispatch()
    return (
        <TextInput
            onChange={async(event) => {
                const word = event.target.value
                refine(word)
                if(word) dispatch(setShouldFetchHits(true))
                else dispatch(setShouldFetchHits(false))
                console.log(word);
                event.currentTarget.focus()
            }}
            autoFocus
            icon={<IconSearch size={20} color="gray" className="min-h-full" />}
            placeholder="Search here.."
            className='max-w-sm'
            value={currentRefinement}
        // ref={textRef}
        // rightSection={
        //     searchActive.text && (
        //         <ActionIcon
        //             size="sm"
        //             variant='outline'
        //             onClick={() => {
        //                 if (textRef.current) {
        //                     textRef.current.value = '';
        //                     setsearchActive(prev => ({ ...prev, text: "" }));
        //                 }
        //             }}
        //         >
        //             <IconX />
        //         </ActionIcon>
        //     )
        // }
        />
    )
}


// const SearchBox = ({ currentRefinement, refine }) => (
//     <input
//         type="text"
//         value={currentRefinement}
//         onChange={(event) => refine(event.currentTarget.value)}
//     />
// );

// const Hits = ({ hits }) => (
//     <ul>
//         {hits.map((hit) => (
//             <li key={hit.objectID}>{hit.title}</li>
//         ))}
//     </ul>
// );

// const CustomSearchBox = connectSearchBox(SearchBox);
// const CustomHits = connectHits(Hits);

// const App = () => {
//     const [shouldFetchHits, setShouldFetchHits] = useState(false);

//     const handleSearch = (query) => {
//         // Perform search or update the state to enable fetching hits
//         setShouldFetchHits(true);
//     };

//     return (
//         <InstantSearch
//             appId="YOUR_ALGOLIA_APP_ID"
//             apiKey="YOUR_ALGOLIA_API_KEY"
//             indexName="your_index_name"
//         >
//             <CustomSearchBox currentRefinement="" refine={handleSearch} />
//             {shouldFetchHits && <CustomHits initiallyRenderedHits={[]} />}
//         </InstantSearch>
//     );
// };

// export default App;