import "@lavaclient/queue/register";

declare module "lavaclient" {

}

declare module "@lavaclient/queue" {
    interface Queue {
        channel: string;
    }
}
