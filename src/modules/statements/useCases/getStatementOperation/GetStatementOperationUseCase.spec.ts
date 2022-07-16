import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError";

let getStatementOperationUseCase : GetStatementOperationUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository : InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository,
        );
    })

    it("should not be able to show balance of a nonexistent user", async () => {
        expect(async () => {
            const statement = await inMemoryStatementsRepository.create({
                user_id: "id_valido",
                description: "Deposito na conta",
                amount: 1000,
                type: OperationType.DEPOSIT
            })

            await getStatementOperationUseCase.execute({ 
                user_id: "id_inexistente", 
                statement_id: statement.id as string 
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("should be able to get statement operation of an user", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Marcelo Teste",
            email: "marcelo@teste.com",
            password: "1234"
        })

        const statement1 = await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: "Deposito na conta",
            amount: 1000,
            type: OperationType.DEPOSIT
        })        

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement1.id as string
        })
        
        expect(statementOperation).toHaveProperty("id")
        expect(statementOperation).toHaveProperty("user_id")
    })

    it("should not be able to show a nonexistent operation", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                name: "Marcelo Teste",
                email: "marcelo@teste.com",
                password: "1234"
            })        
    
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: "statement_inexistente"
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})