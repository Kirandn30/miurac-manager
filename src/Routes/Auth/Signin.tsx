import React, { useEffect, useState } from 'react'
import image from '../../assets/page1.png'
import { Divider, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core'
import { useNavigate } from "react-router-dom"
import { useForm } from '@mantine/form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react'
import { GoogleButton } from './GoogleIcon'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'

export const Signin = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.user)

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length >= 6 ? null : 'Password must contain 6 characters at least',
        },
    });

    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [navigate, user])

    return (
        <form onSubmit={form.onSubmit(async (values) => {
            try {
                setLoading(true)
                await signInWithEmailAndPassword(auth, values.email, values.password);
                navigate("/")
                setLoading(false)
            } catch (error) {
                showNotification({
                    id: `reg-err-${Math.random()}`,
                    autoClose: 5000,
                    title: 'Error!',
                    message: "Error logging into account try again",
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            } finally {
                setLoading(false)
            }
        })}>
            <div className='min-h-screen grid  md:grid-cols-2'>
                <div
                    className='h-full'
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div className='p-5 md:w-3/4 md:m-auto space-y-5'>
                    <Title align='center' pb={30}>
                        Welcome Back
                    </Title>
                    <div
                        className='space-y-3'
                    >
                        <TextInput
                            placeholder='Example.email@gmail.com'
                            label='Email'
                            variant='unstyled'
                            classNames={{
                                root: "border-solid border-b-[1px] border-black",
                                input: "px-3"
                            }}
                            {...form.getInputProps("email")}
                        />
                        <PasswordInput
                            placeholder="Enter at least 6+ characters"
                            label="Password"
                            variant='unstyled'
                            classNames={{
                                root: "border-solid border-b-[1px] border-black",
                            }}
                            {...form.getInputProps("password")}
                        />
                        <div>
                            <Button fullWidth loading={loading} type='submit' >
                                Login
                            </Button>
                            <div className='flex justify-end'>
                                <Button
                                    size='xs'
                                    variant='white'
                                    onClick={async () => {
                                        navigate("/passwordreset")
                                    }}
                                >Forgot Password?</Button>
                            </div>
                        </div>
                    </div>
                    <Divider label='Or' labelPosition="center" />
                    <div className='text-center'>
                        <GoogleButton>Continue with Google</GoogleButton>
                    </div>
                    <div className='flex gap-2 text-xs select-none justify-center'>
                        <Text>Don't have an account?</Text>
                        <Text
                            color='blue'
                            className='cursor-pointer hover:scale-105 duration-100 ease-linear'
                            onClick={() => navigate('/')}
                        >Sign Up</Text>
                    </div>
                </div>
            </div>
        </form>
    )
}