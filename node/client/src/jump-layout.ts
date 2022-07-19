import { ButtonColor, ButtonIcon } from '@server/messages'

// export default object
export default {
  gridAreas: ['left go right', 'left stop right', 'jump jump jump'],
  gridColumns: '1fr 1fr 1fr',
  gridRows: '1fr 1fr 0.75fr',
  buttons: [
    {
      name: 'left',
      color: ButtonColor.Blue,
      icon: ButtonIcon.Left,
    },
    {
      name: 'right',
      color: ButtonColor.Blue,
      icon: ButtonIcon.Right,
    },
    {
      name: 'jump',
      color: ButtonColor.Purple,
      icon: ButtonIcon.Jump,
    },
    {
      name: 'go',
      color: ButtonColor.Green,
      icon: ButtonIcon.Go,
    },
    {
      name: 'stop',
      color: ButtonColor.Red,
      icon: ButtonIcon.Stop,
    },
  ],
}
