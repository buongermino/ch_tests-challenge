import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase : GetBalanceUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository : InMemoryStatementsRepository;

describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );
    })

    it("should not be able to show balance of a nonexistent user", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: "id_inexistente" })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
    
    it("should be able to show balance of an user", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Marcelo Teste",
            email: "marcelo@teste.com",
            password: "1234"
        })

        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: "Deposito na conta",
            amount: 1000,
            type: OperationType.DEPOSIT
        })

        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: "Saque na conta",
            amount: 500,
            type: OperationType.WITHDRAW
        })

        const balance = await getBalanceUseCase.execute({ user_id: user.id as string })
        

        expect(balance).toHaveProperty("balance")
        expect(balance).toHaveProperty("statement[]")
        expect(balance.statement).toHaveLength(2)
    })

   
})