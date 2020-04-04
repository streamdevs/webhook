const { initServer } = require("../src/server");

describe("server", () => {
  describe("POST /github", () => {
    const config = { port: 8080 };

    it("returns 200 ok ", async () => {
      const subject = initServer(config);

      const { statusCode } = await subject.inject({
        method: "POST",
        url: "/github",
      });

      expect(statusCode).toBe(200);
    });
  });
});
