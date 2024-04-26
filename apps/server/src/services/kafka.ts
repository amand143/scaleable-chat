import { Producer, Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";


const kafka = new Kafka({
  brokers: [''],
  ssl: {
    ca: [],
  },
  sasl: {
    username: "",
    password: "",
    mechanism: "",
  },
})

let producer: null | Producer = null;

export async function createProducer() {
    if(producer) return producer;
    const _producer = kafka.producer();
    console.log("producer created");
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function createMessage(message:string) {
    const producer = await createProducer();
    await producer.send({
        topic: 'MESSAGES',
        messages: [
          { key: `message-${Date.now()}`,
            value: message },
        ],
      });
      console.log("message prodcuer to broker");
    return true;
}

export async function startConsumer() {
    const consumer = kafka.consumer({ groupId: 'default' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true })

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause }) => {
       if(!message.value)return;
       console.log("consumer received");
        try {
            await prismaClient.message. create({
                data: {
                    text: message.value?.toString(),
                },
            });
            
        }
        catch(e){
            console.log("server down, waiting 1min");
            pause();
            setTimeout(() =>{
                consumer.resume([{topic: "MESSAGES"}]);
            }, 60*1000);
        }
    },
    })
}

export default kafka;