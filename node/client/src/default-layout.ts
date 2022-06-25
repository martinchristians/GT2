import { ButtonColor, ButtonIcon } from '@server/messages'

// export default object
export default {
  gridAreas: ['left go right', 'left stop right'],
  gridColumns: '1fr 1fr 1fr',
  gridRows: '1fr 1fr',
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
