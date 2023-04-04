import { test } from "@japa/runner";
import { SchemaParser, ConfigFileImporter } from "@lazyedge/helpers";
import { V1SchemaInterface } from "@lazyedge/types";
import { resolve as resolvePath } from "path";

//
// Configuration parsing testing
//
test.group("Configuration -> Config Parsing", (group) => {
  group.tap((test) => test.tags(["config"]));

  test("parse valid v1 schema", ({ assert }) => {
    assert.doesNotThrows(() => {
      new SchemaParser({
        deploy: {
          registry: "unknown registry",
        },
        routes: [
          {
            name: "test",
            entrypoint: "./routes/index.ts",
          },
        ],
      });
    });
  });

  test("try to parse invalid v1 schema", ({ assert }) => {
    assert.throws(() => {
      new SchemaParser({
        hello: "world",
      });
    });
  });

  test("try to parse schema from file exported using CommonJS", ({
    assert,
  }) => {
    assert.doesNotThrows(() => {
      ConfigFileImporter.from(
        resolvePath(__dirname, "./commonjs/config.js")
      ).asConfig();
    });
  });

  test("try to import INVALID file exported using CommonJS", ({ assert }) => {
    assert.throws(() => {
      ConfigFileImporter.from(
        resolvePath(__dirname, "./commonjs/config.invalid.js")
      ).asConfig();
    });
  });

  test("try to parse schema from file exported using ESModules", ({
    assert,
  }) => {
    assert.doesNotThrows(() => {
      ConfigFileImporter.from(
        resolvePath(__dirname, "./es/config.js")
      ).asConfig();
    });
  });

  test("try to import INVALID file exported using ESModules", ({ assert }) => {
    assert.throws(() => {
      ConfigFileImporter.from(
        resolvePath(__dirname, "./es/config.invalid.js")
      ).asConfig();
    });
  });

  test("try to parse .ts config", ({ assert }) => {
    assert.doesNotThrows(() => {
      ConfigFileImporter.from(
        resolvePath(__dirname, "./misc/ts-config.ts")
      ).asConfig();
    });
  });
});

//
// Route annotations testing
//
test.group("Configuration -> Annotations", (group) => {
  group.tap((test) => test.tags(["config"]));

  function schemaWithAnnotation(name: string, value: any): V1SchemaInterface {
    return {
      deploy: {
        registry: "unknown",
      },
      routes: [
        {
          name: "test",
          entrypoint: "./index.ts",
          annotations: {
            [name]: value,
          },
        },
      ],
    };
  }

  test("route's string annotation", ({ assert }) => {
    const config = new SchemaParser(schemaWithAnnotation("string", "world"));

    assert.equal(config.raw().routes[0].annotations!.string, "world");
  });

  test("route's array of strings annotation", ({ assert }) => {
    const config = new SchemaParser(
      schemaWithAnnotation("array", ["hello", "world"])
    );

    assert.deepEqual(config.raw().routes[0].annotations!.array, [
      "hello",
      "world",
    ]);
  });

  test("routes's boolean annotation", ({ assert }) => {
    const config = new SchemaParser(schemaWithAnnotation("isBoolean", true));

    assert.equal(config.raw().routes[0].annotations!.isBoolean, true);
  });

  test("route's number annotation", ({ assert }) => {
    const config = new SchemaParser(schemaWithAnnotation("number", 10));

    assert.equal(config.raw().routes[0].annotations!.number, 10);
  });

  test("route's static computed function annotation", ({ assert }) => {
    const config = new SchemaParser(
      schemaWithAnnotation("function", () => {
        return "hewwo dogs!";
      })
    );

    assert.equal(
      config.computed().routes[0].annotations!.function,
      "hewwo dogs!"
    );
  });
});
