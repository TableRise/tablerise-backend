const SYSTEM_MOCK_INSTANCE = {
  _id: '6462a072d1676071bfa5d58e',
  name: 'rpg_system',
  reference: 'rpg_system.ebook.com',
  rule_ids: {
    race: ['64629a053d6566450778b0e1'],
    class: ['64629a053d6566450778b0e1'],
    items: ['64629a053d6566450778b0e1'],
    attacks: ['64629a053d6566450778b0e1'],
    background: ['64629a053d6566450778b0e1']
  },
  details: 'rpg_system_details'
}

const SYSTEM_MOCK_PAYLOAD = {
  name: 'rpg_system',
  reference: 'rpg_system.ebook.com',
  rule_ids: {
    race: ['64629a053d6566450778b0e1'],
    class: ['64629a053d6566450778b0e1'],
    items: ['64629a053d6566450778b0e1'],
    attacks: ['64629a053d6566450778b0e1'],
    background: ['64629a053d6566450778b0e1']
  },
  details: 'rpg_system_details'
}

const ZOD_ERROR_SYSTEM_NAME = {
  name: 'PAYLOAD_ERROR',
  message: [
    {
      code: 'invalid_type',
      expected: 'string',
      received: 'undefined',
      path: [
        'name'
      ],
      message: 'Required'
    }
  ]
}

export {
  SYSTEM_MOCK_INSTANCE,
  SYSTEM_MOCK_PAYLOAD,
  ZOD_ERROR_SYSTEM_NAME
};
