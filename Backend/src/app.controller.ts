import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    console.log("jldskfjdslkjfdslfjdskjfdsljfds")
    return "Hello World"
  }
}
