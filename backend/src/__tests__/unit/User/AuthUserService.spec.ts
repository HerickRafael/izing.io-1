import faker from "faker";
import AppError from "../../../errors/AppError";
import AuthUserService from "../../../services/UserServices/AuthUserSerice";
import CreateUserService from "../../../services/UserServices/CreateUserService";
import { disconnect, truncate } from "../../utils/database";

describe("Auth", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    await disconnect();
  });

  it("should be able to login with an existing user", async () => {
    await CreateUserService({
      name: faker.name.findName(),
      email: "mail@test.com",
      password: "hardpassword",
      tenantId: 1
    });

    const response = await AuthUserService({
      email: "mail@test.com",
      password: "hardpassword"
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to login with not registered email", async () => {
    const promise = AuthUserService({
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      statusCode: 401,
      message: "ERR_INVALID_CREDENTIALS"
    });
  });

  it("should not be able to login with incorrect password", async () => {
    await CreateUserService({
      name: faker.name.findName(),
      email: "mail@test.com",
      password: "hardpassword",
      tenantId: 1
    });

    const promise = AuthUserService({
      email: "mail@test.com",
      password: faker.internet.password()
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      statusCode: 401,
      message: "ERR_INVALID_CREDENTIALS"
    });
  });
});
