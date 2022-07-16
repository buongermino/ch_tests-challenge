import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository : InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository : InMemoryUsersRepository; 

describe("Create statement", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository, 
            inMemoryStatementsRepository
        )
    })

    it("should not be able to create any statement for a nonexistent user", async () => {
        expect(async () => {
            await inMemoryUsersRepository.create({
                name: "Marcelo Teste",
                email: "marcelo@teste.com",
                password: "1234"
            });

            await createStatementUseCase.execute({
                user_id: "id_inexistente",
                description: "Pagamento recebido",
                amount: 500,
                type: OperationType.DEPOSIT
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("should be able to create a deposit statement", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Marcelo Teste",
            email: "marcelo@teste.com",
            password: "1234"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            description: "Pagamento recebido",
            amount: 500,
            type: OperationType.DEPOSIT
        })
                
        expect(statement).toHaveProperty("id");
        expect(statement.type).toEqual("deposit")   
    })

    it("should be able to withdraw", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Marcelo Teste",
            email: "marcelo@teste.com",
            password: "1234"
        });
        
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: "Deposito na conta",
            amount: 1000,
            type: OperationType.DEPOSIT
        })

        const withdraw = await createStatementUseCase.execute({
            user_id: user.id as string,
            description: "Saque na conta",
            amount: 500,
            type: OperationType.WITHDRAW
        })        
                        
        expect(withdraw).toHaveProperty("id");
        expect(withdraw.type).toEqual("withdraw")
    })

    it("should not be able to withdraw if the funds are insufficient", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                name: "Marcelo Teste",
                email: "marcelo@teste.com",
                password: "1234"
            });       
    
            await createStatementUseCase.execute({
                user_id: user.id as string,
                description: "Saque na conta",
                amount: 500,
                type: OperationType.WITHDRAW
            })   
           
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

})