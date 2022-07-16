import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository;
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "Marcelo Tester",
            email: "marcelo_testador@jest.com",
            password: "1234"
        })
        
        expect(user).toHaveProperty("id");        
    })

    it("should not be able to create a user with an existent email", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "Marcelo Tester",
                email: "marcelo_testador@jest.com",
                password: "1234"
            })
            await createUserUseCase.execute({
                name: "Marcelo Testador",
                email: "marcelo_testador@jest.com",
                password: "1234"
            })   
        }).rejects.toBeInstanceOf(CreateUserError);
    })
})