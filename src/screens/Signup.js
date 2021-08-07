import { gql, useMutation } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount($firstName: String!, $lastName: String,$username: String!, $email: String!, $password: String!){
        createAccount(firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password){
            ok
            error
        }
    }
`;

function Signup() {
    const { register, handleSubmit, formState, setError, clearErrors, getValues } = useForm({
        mode: "onChange",
    });

    const history = useHistory();
    const onCompleted = (data) => {
        const { username, password } = getValues();
        const {
            createAccount: { ok, error },
        } = data;
        if (!ok) {
            return setError("result", {
                message: error
            });
        }
        history.push(routes.home, {
            message: "Account created. Please log in.",
            username,
            password,
        });
    };

    const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
        onCompleted,
    });

    const onSubmitValid = (data) => {
        if (loading) {
            return;
        }
        const { firstName, lastName, email, username, password } = getValues();

        createAccount({
            variables: { firstName, lastName, email, username, password }
        });
    };

    return (
        <AuthLayout>
            <PageTitle title="Sign up" />
            <FormBox>
                <HeaderContainer>
                    <FontAwesomeIcon icon={faInstagram} size="3x" />
                    <Subtitle>
                        Sign up to see photos and videos from your friends.
                    </Subtitle>
                </HeaderContainer>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input {...register("firstName", { required: "First Name is required", })} onFocus={() => clearErrors("result")} name="firstName" type="text" placeholder="First Name" />
                    <FormError message={formState.errors?.firstName?.message} />
                    <Input {...register("lastName")} onFocus={() => clearErrors("result")} name="lastName" type="text" placeholder="Last Name" />
                    <Input {...register("email", { required: "Email is required", })} onFocus={() => clearErrors("result")} name="email" type="text" placeholder="Email" />
                    <FormError message={formState.errors?.email?.message} />
                    <Input {...register("username", {
                        required: "Username is required", minLength: {
                            value: 5,
                            message: "Username should be longer than 5 chars.",
                        },
                    })} onFocus={() => clearErrors("result")} name="username" type="text" placeholder="Username" />
                    <FormError message={formState.errors?.username?.message} />
                    <Input {...register("password", { required: "Password is required", })} onFocus={() => clearErrors("result")} name="password" type="password" placeholder="Password" />
                    <FormError message={formState.errors?.password?.message} />
                    <Button type="submit" value={loading ? "Loading..." : "Sign Up"} disabled={!formState.isValid || loading} />
                    <FormError message={formState.errors?.result?.message} />
                </form>
            </FormBox>
            <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
        </AuthLayout>
    );
}
export default Signup;