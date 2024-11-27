import React from 'react'
import { Button, Paper, Text } from '@mantine/core'

function Discount({ discountApplied, setDiscountApplied }: { discountApplied: boolean, setDiscountApplied: React.Dispatch<React.SetStateAction<boolean>> }) {

    return (
        <Paper shadow="xs" radius="lg" withBorder p="xl">
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <Text>You have enough <span style={{ color: "green" }}>ECO-points</span> to qualify for 15% discount!</Text>
                    <Text>Would you like to apply it for this purchase?</Text>
                </div>
                {discountApplied && <Button disabled>Apply Discount</Button>}
                {!discountApplied && <Button onClick={() => { setDiscountApplied(true) }}>Apply Discount</Button>}

            </div>
        </Paper>
    )
}

export default Discount