# 🌱 GREENHOUSE MANAGEMENT SYSTEM 🌱

## Project Description:

### 1. Project Objectives:

The greenhouse management project is developed to provide users with a comprehensive website tool to monitor and control the environment inside each greenhouse in real time, proactively and efficiently. Through this system, users can easily monitor parameters such as temperature, humidity, light… from sensors installed in each specific greenhouse. The system will automatically detect and send notifications when any parameter exceeds the limit set by the user, helping operators promptly handle abnormal situations. Additionally, users can directly control devices such as water pumps, ventilation fans, lighting systems,... to actively adjust environmental conditions and optimize plant growth.

### 2. Functional and Non-Functional requirement:

The main actor of the web application is the greenhouse supervisor.

#### a. Functional requirement

- ✅ Login, logout

- ✅ Add and remove devices

- ✅ Turn control devices on and off

- ✅ View real-time data from sensors

- ✅ Receive system notifications when a device exceeds the maximum threshold

- ✅ Receive email notifications when a device exceeds the maximum threshold

- ✅ Create, view, edit, delete operation schedules for control devices

#### b. Non-functional requirement

**Security** 🔒

- Use encryption for sensitive data, both during transmission and storage.

**User Interface** 🖥️

- The system must display the current status through a clear and easy-to-understand interface:
  - ⚡ Immediate notifications: After the user clicks the "Add Device" button, the system must provide a response notification within 1–4 seconds (e.g., "Device added successfully"). During the waiting period, the system must show a processing status (e.g., loading icon) so the user knows their request has been received and is being processed.
  - ⚠️ Error status warning: If an error occurs, the interface must display a clear error message within 1–4 seconds, e.g., "Email or password is incorrect".
  - 🗣️ The system uses everyday language that users are familiar with and avoids confusing technical terms. For example, for common errors like 404, instead of displaying "Error 404: Page Not Found", the system uses a more friendly message such as "Your page is not found. Please check your address!".
  - 🌐 The interface must not cause rendering errors on popular browsers (Chrome 43.0, Microsoft Edge 10.0, Mozilla 16.0, Safari 9.0 and above).

## 🧠 Key Features

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

## Addition Information

Use-case and Database design is written in file **Description.pdf**
