import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Form, Field, Radio, Button, Loader } from 'rimble-ui';

import api from '../../service/api';

const Login = () => {

    const history = useHistory();
    const [cookies, setCookie] = useCookies();

    const [validated, setValidated] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [radioValue, setRadioValue] = useState("client");
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function handleLogin(e) {
        setLogin(e.target.value);
    };

    function handlePassword(e) {
        setPassword(e.target.value);
    };

    function handleRadio(e) {
        setRadioValue(e.target.value);
    };

    const validateForm = useCallback(
        () => {
            if (
                login.length > 0 &&
                password.length > 5 &&
                radioValue.length > 0 &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [login, password, radioValue, isLoading]
    );

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    useEffect(() => {
        if (validated && isLoading) {
            console.log("Submitted valid form");
            try {
                api
                    .post(`/${radioValue}/login`, { login, password })
                    .then(res => {
                        if (res.status === 200) {
                            setCookie('userJWT', res.data.userJWT);
                            setCookie('ledgerId', res.data.ledgerId);
                            history.push(`/${radioValue}`);
                        } else {
                            console.log('Oopps... something wrong, status code ' + res.status);
                            return function cleanup() { }
                        }
                    })
                    .catch((err) => {
                        console.log('Oopps... something wrong');
                        console.log(err);
                        return function cleanup() { }
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                console.log('Oopps... something wrong');
                console.log(error);
                setIsLoading(false);
                return function cleanup() { }
            }
        }
    }, [login, password, radioValue, validated, isLoading, history, setCookie]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
    };

    return (
        <Flex height={'100vh'}>
            <Box mx={'auto'} my={'auto'} width={[1, 1 / 2, 1 / 3, 1 / 4]}>
                <Card>
                    <Heading as={"h1"} mx={'auto'} color={'primary'}>eKYC</Heading>
                    <Form onSubmit={handleSubmit}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Login" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleLogin}
                                        value={login}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Passoword" width={1}>
                                    <Form.Input
                                        type="password"
                                        required
                                        onChange={handlePassword}
                                        value={password}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Role">
                                    <Radio
                                        label="Client"
                                        required
                                        my={2}
                                        value={"client"}
                                        checked={radioValue === "client"}
                                        onChange={handleRadio}
                                    />
                                    <Radio
                                        label="Financial Institution"
                                        my={2}
                                        value={"fi"}
                                        checked={radioValue === "fi"}
                                        onChange={handleRadio}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Button type="submit" disabled={submitDisabled} width={1}>
                            {isLoading ? <Loader color="white" /> : <p>Login</p>}
                        </Button>
                    </Form>
                </Card>
            </Box>
        </Flex>
    );
}

export default Login;