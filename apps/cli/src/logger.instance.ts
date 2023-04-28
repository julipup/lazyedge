import { Signale } from "signale";

export function getDefaultLogger() {
    return new Signale({});
};

export function getInteractiveLogger() {
    return new Signale({
        interactive: true
    })
};