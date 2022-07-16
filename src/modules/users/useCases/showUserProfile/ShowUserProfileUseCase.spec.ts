import { ProfileMap } from "../../mappers/ProfileMap";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository : InMemoryUsersRepository;
let showUserProfileUseCase : ShowUserProfileUseCase;
let authenticateUserUseCase : AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    })

    it("should be able to return profile information of an authenticated user", async () => {
       const user = await createUserUseCase.execute({
            name: "Marcelo Testador",
            email: "emailteste@jest.com",
            password: "1234",           
        });
                
        const userLoggedIn = await authenticateUserUseCase.execute({
            email: "emailteste@jest.com",
            password: "1234",
        })
        

        const profile = await showUserProfileUseCase.execute(userLoggedIn.user.id as string)

        const profileDTO = ProfileMap.toDTO(profile)
        const userDTO  = ProfileMap.toDTO(user)
      
        expect(profileDTO).toEqual(userDTO);
    })
   

    it("should not be able to show a profile of a nonexistent user", async () => {
        expect(async () => {           
            await showUserProfileUseCase.execute("id_inexistente")
    
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    })
})