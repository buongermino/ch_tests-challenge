import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
         inMemoryUsersRepository = new InMemoryUsersRepository();
         authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
         createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "Marcelo Testador",
            email: "emailteste@jest.com",
            password: "1234",
        }
        
        await createUserUseCase.execute(user);

        const userLoggedIn = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        })
        
        expect(userLoggedIn).toHaveProperty("token");

        })
    

    it("should not be able to authenticate a nonexistent user", async () => {
       expect(async () => {
        await authenticateUserUseCase.execute({
            email: "Marcelo Inexistente",
            password: "password inexistente",
        })
       }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    it("should not be able to authenticate an user with wrong password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "Marcelo Testador",
                email: "emailteste@jest.com",
                password: "1234",
            }
            
            await createUserUseCase.execute(user);
    
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "password incorreto",
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
        
    })
})