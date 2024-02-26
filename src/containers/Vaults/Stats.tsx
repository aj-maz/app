import { useMemo } from 'react'

import { formatNumberWithStyle } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'

import { HaiButton, Text } from '~/styles'
import { RewardsTokenArray } from '~/components/TokenArray'
import { Stats, type StatProps } from '~/components/Stats'
import { Link } from '~/components/Link'

export function BorrowStats() {
    const {
        vaultModel: { list, liquidationData },
    } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((actions) => actions)

    const stats: StatProps[] = useMemo(() => {
        const { totalCollateralInUSD, totalHai, weightedStabilityFee } = list.reduce(
            (obj, { collateral, collateralName, debt, totalAnnualizedStabilityFee }) => {
                const collateralPriceInUSD =
                    liquidationData?.collateralLiquidationData[collateralName]?.currentPrice.value || '0'
                obj.totalCollateralInUSD += parseFloat(collateral) * parseFloat(collateralPriceInUSD)
                obj.totalHai += parseFloat(debt)
                obj.weightedStabilityFee += (parseFloat(totalAnnualizedStabilityFee) - 1) * parseFloat(debt)
                return obj
            },
            { totalCollateralInUSD: 0, totalHai: 0, weightedStabilityFee: 0 }
        )

        const totalDebtInUSD = totalHai * parseFloat(liquidationData?.currentRedemptionPrice || '1')

        const weightedStabilityFeeAverage = !list.length || !totalHai ? 0 : weightedStabilityFee / totalHai

        // TODO: dynamically calculate apy, hook up rewards
        return [
            {
                header: totalCollateralInUSD
                    ? formatNumberWithStyle(totalCollateralInUSD.toString(), {
                          style: 'currency',
                          maxDecimals: 1,
                          suffixed: true,
                      })
                    : '--',
                label: 'My Locked Collateral',
                tooltip:
                    'Summation of the total amount of a given collateral locked in your vaults multiplied by the protocol oracle price of that collateral.',
            },
            {
                header: totalDebtInUSD
                    ? formatNumberWithStyle(totalDebtInUSD.toString(), {
                          style: 'currency',
                          maxDecimals: 1,
                          suffixed: true,
                      })
                    : '--',
                label: 'My Total Debt',
                tooltip: 'The total amount of minted debt tokens multiplied by the protocol redemption price of debt.',
            },
            {
                header: formatNumberWithStyle(weightedStabilityFeeAverage, { style: 'percent', maxDecimals: 1 }),
                label: 'My Net Stability Fee',
                tooltip: 'Weighted average stability fee of My Total Debt',
            },
            {
                header: '7.8%',
                label: 'My Net Rewards APY',
                tooltip: (
                    <Text>
                        Rewards derived from all campaign activities. See <Link href="/earn">here</Link> for more
                        information.
                    </Text>
                ),
            },
            {
                header: '$--',
                headerStatus: <RewardsTokenArray tokens={['OP', 'KITE']} hideLabel />,
                label: 'My Vault Rewards',
                tooltip: 'Rewards currently voted upon and distributed by DAO approximately once per month.',
                button: (
                    // <HaiButton $variant="yellowish" onClick={() => popupsActions.setIsClaimPopupOpen(true)}>
                    //     Claim
                    // </HaiButton>
                    <HaiButton title="Claim window is closed" $variant="yellowish" disabled>
                        Claim
                    </HaiButton>
                ),
            },
        ]
    }, [list, liquidationData, popupsActions])

    if (!list.length) return null

    return <Stats stats={stats} columns="repeat(4, 1fr) 1.6fr" fun />
}
