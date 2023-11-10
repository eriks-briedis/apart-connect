import { Initative, Property, notifyAllUsersInProperty } from '../models'

export const sendNewInitiativeNotifications = async (property: Property, initiative: Initative) => {
  await notifyAllUsersInProperty({
    property,
    type: 'initiative',
    title: `Jauns balsojums`,
    message: `Ir izveidots jauns balsojums "${initiative.label}". Lūdzu, izsaki savu viedokli!`,
    url: `/properties/${property.id}/initiatives/${initiative.id}`,
  })
}
