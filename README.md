<p align="center"><strong>Greenhouse Management System</strong></p>
<p align="center">
  A smart, scalable, and efficient server-side application built with NestJs to manage greenhouse operations.
</p>

<p align="center"> <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS logo" /> </p> <h2 align="center">Greenhouse Project</h2> <p align="center"> A real-time backend system for managing smart greenhouse environments. </p> <p align="center"> <strong>Tech Stack:</strong> NestJS · MQTT · SSE · RxJS · Bull (Redis) · NodeMailer · Prisma · MySQL · JWT · Argon2 </p>

## 🚀 Project Overview

A real-time backend system for managing smart greenhouse environments,  
built with a focus on **responsiveness**, **automation**, and **system integrity**.

### 🧠 Key Features

- ⚡ **Real-time MQTT integration** via [Adafruit IO](https://io.adafruit.com/) to receive live sensor data and control actuators.
- 🔁 **Reactive data handling** using **RxJS** and the **Observer pattern** for efficient stream processing.
- ⏱️ **Automated task scheduling** (e.g., irrigation) with **Bull Queue** and **Redis**.
- 🚨 **Dynamic alert system** with threshold monitoring and **email notifications** via **NodeMailer**.
- 📡 **Live dashboard updates** using **Server-Sent Events (SSE)** for seamless real-time data streaming.
- 🔐 **Secure authentication** using **JWT** & **Argon2**, with **role-based access control (RBAC)** through **NestJS Guards & decorators**.
- 🗃️ **Database operations** managed by **Prisma ORM** and **MySQL** for type-safe and scalable data handling.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

## Review Schedule job using Bull board
$ node bull-boards.ts
```
