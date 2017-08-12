import { Command } from './command';
import {Message} from '../entities/message';
import {MessageBus} from '../lib/messageBus';
import {Constants} from '../lib/constants';






export class CmdShowFormFontLoad extends Command {

  constructor() {
    super();

  }
  protected execute(): void {

      MessageBus.publish(Message.ShowFormFontLoad,undefined);
  }
}
