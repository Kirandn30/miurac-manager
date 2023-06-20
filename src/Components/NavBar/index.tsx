import { ReactNode, useEffect, useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Text,
    useMantineTheme,
    createStyles,
    Tooltip,
    UnstyledButton,
    ActionIcon,
    Image
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconInbox, IconNotes } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { RootState } from '../../redux';
import { auth } from '../../firebaseConfig';

export default function NavBar({ children }: { children: ReactNode }) {
    const matches = useMediaQuery('(min-width: 767px)');
    const { CompanyDetails } = useSelector((state: RootState) => state.user)
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [active, setActive] = useState(0);
    const [reduceSize, setReduceSize] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!matches) {
            setReduceSize(true)
        }
    }, [matches])

    const useStyles = createStyles((theme) => ({
        link: {
            width: reduceSize ? 245 : 50,
            transitionDuration: "100ms",
            transitionTimingFunction: "linear",
            height: 50,
            borderRadius: theme.radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.yellow[0],
            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[9],
            },
        },

        active: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    }));

    const mockdata = [
        { icon: IconNotes, label: 'Project', link: '' },
        { icon: IconInbox, label: 'Inbox', link: 'inbox' },
    ];

    function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
        const { classes, cx } = useStyles();
        return (
            <Tooltip label={label} position="right" disabled={reduceSize}>
                <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                    <div className={reduceSize ? 'w-full grid grid-cols-3 gap-3' : ""}>
                        <Icon className='justify-self-center text-white' stroke={1.5} />
                        {reduceSize && <Text style={{ color: "white" }} size={15} className='col-span-2'>{label}</Text>}
                    </div>
                </UnstyledButton>
            </Tooltip >
        );
    }

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                if (mockdata[index].link === "logout") {
                    signOut(auth).then(() => navigate("/"))
                } else {
                    setActive(index)
                    navigate(`/${mockdata[index].link}`)
                    setOpened(false)
                }
            }}
        />
    ));

    return (
        <AppShell
            layout='alt'
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
                },
            }}
            navbarOffsetBreakpoint="sm"
            navbar={
                <div className='h-full'>
                    <Navbar
                        className='ease-linear duration-200 h-full'
                        p="xs"
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{ sm: reduceSize ? 280 : 85 }}
                        style={{ backgroundColor: "#003152FF" }}
                    >
                        <div className='space-y-10'>
                            <div className='flex gap-3 my-3'>
                                <div className='w-fit rounded-2xl overflow-clip'>
                                    <Image
                                        src={CompanyDetails?.companyLogo}
                                        alt={CompanyDetails?.name}
                                        height={50}
                                        width={50}
                                    />
                                </div>
                                {reduceSize && <div className='text-white'>
                                    <Text size={20} className='text-center font-bold'>{CompanyDetails?.name}</Text>
                                    <Text size={10} className='text-right' style={{ color: '#EF9834FF' }}>Dashboard</Text>
                                </div>}
                            </div>
                            <div className='space-y-1'>
                                {links}
                            </div>
                        </div>
                        <div className='absolute bottom-5 right-5'>
                            <ActionIcon className={reduceSize ? 'hidden md:block justify-self-end text-black' : 'hidden md:block justify-self-center text-black'} onClick={() => setReduceSize(prev => !prev)}>
                                {reduceSize ? <IconChevronLeft /> : <IconChevronRight />}
                            </ActionIcon>
                        </div>
                    </Navbar>
                </div>
            }
            // aside={
            //     <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            //         <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            //             <Text>Application sidebar</Text>
            //         </Aside>
            //     </MediaQuery>
            // }
            // footer={
            //     <Footer height={60} p="md">
            //         Application footer
            //     </Footer>
            // }
            header={
                <Header height={{ base: 80, md: 70 }} p="md" className='shadow-lg'>
                    <div className='w-fit'>
                        <div className='flex gap-x-1'>
                            <Text style={{ color: '#003152FF' }}>Project</Text>
                            <Text style={{ color: '#EF9834FF' }}>Management</Text>
                        </div>
                        <Text align='right' size="xs" color='#003152FF'>Powered by Miurac</Text>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}

interface NavbarLinkProps {
    icon: any;
    label: string;
    active?: boolean;
    onClick?(): void;
}