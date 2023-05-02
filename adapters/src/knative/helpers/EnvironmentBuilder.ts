import { KnativeEnvironment } from "../Environment";

export class EnvironmentBuilder {
    private id = KnativeEnvironment.name;
    private registry = "docker.io";
    private spaceId = "default";

    public withId(id: string) {
        this.id = id;
        return this;
    };

    public withRegistry(registry: string) {
        this.registry = registry;
        return this;
    };

    public inSpace(spaceId: string) {
        this.spaceId = spaceId;
        return this;
    };

    public build(): KnativeEnvironment {
        return new KnativeEnvironment(this.id, this.spaceId, this.registry);
    };
};