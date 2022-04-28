import React, { useEffect, useState } from 'react'
import { Form, Grid, Dropdown } from 'semantic-ui-react'
// import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  const [currentValue, setCurrentValue] = useState(0)
  const [selectedAction, setCurrentAction] = useState(-1)

  // TODO: Get this from the api
  const Actions = ["Increment", "Decrement", "Idle"];
  const actionOptions = Actions.map((action, index) =>
  ({
    key: action,
    text: action,
    value: index,
  }));

  useEffect(() => {
    let unsubscribe
    api.query.drunkardsWalk
      .counter(newValue => {
        setCurrentValue(newValue.toNumber())
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.templateModule])

  return (
    <Grid.Column width={8}>

      <h1>Drunkards Walk: {currentValue}</h1>

      <div style={{ minHeight: '65px', overflowWrap: 'break-word' }}>{status}</div>

      <Form>
        <Form.Field >
          <Dropdown
            placeholder='Select Action'
            selection
            fluid
            onChange={(_, { value }) => setCurrentAction(value)}
            options={actionOptions}
          />
        </Form.Field >
        <Form.Group >
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              label="Change Action"
              type="SIGNED-TX"
              setStatus={setStatus}
              attrs={{
                palletRpc: 'drunkardsWalk',
                callable: 'change',
                inputParams: [selectedAction],
                paramFields: [true],
              }}
            />
          </Form.Field>
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              label="Execute Action"
              type="SIGNED-TX"
              disabled={selectedAction < 0}
              setStatus={setStatus}
              attrs={{
                palletRpc: 'drunkardsWalk',
                callable: 'execute',
                inputParams: [],
                paramFields: [],
              }}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Grid.Column >
  )
}
export default function TemplateModule(props) {
  const { api } = useSubstrateState()

  return api.query.drunkardsWalk ? (
    <Main {...props} />
  ) : null
}
