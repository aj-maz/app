import { useState } from 'react'

import { Status, formatNumberWithStyle } from '~/utils'
import { useStoreState } from '~/store'
import { useAllVaults, useMediaQuery } from '~/hooks'

import styled from 'styled-components'
import { BlurContainer, CenteredFlex, Flex, Grid, TableButton, Text } from '~/styles'
import { BrandedTitle } from '~/components/BrandedTitle'
import { AddressLink } from '~/components/AddressLink'
import { Pagination } from '~/components/Pagination'
import { StatusLabel } from '~/components/StatusLabel'
import { TokenArray } from '~/components/TokenArray'
import { CheckboxButton } from '~/components/CheckboxButton'
import { LiquidateVaultModal } from '~/components/Modal/LiquidateVaultModal'
import { SortByDropdown } from '~/components/SortByDropdown'
import { Table, TableContainer } from '~/components/Table'
import { HaiArrow } from '~/components/Icons/HaiArrow'
import { CollateralDropdown } from '~/components/CollateralDropdown'
import { Link } from '~/components/Link'

const RECORDS_PER_PAGE = 10

export function VaultExplorer() {
    const {
        vaultModel: { liquidationData },
    } = useStoreState((state) => state)

    const isLargerThanSmall = useMediaQuery('upToSmall')

    const {
        error,
        loading,
        headers,
        rows,
        sorting,
        setSorting,
        filterEmpty,
        setFilterEmpty,
        collateralFilter,
        setCollateralFilter,
    } = useAllVaults()

    const [offset, setOffset] = useState(0)

    const [liquidateVault, setLiquidateVault] = useState<{
        id: string
        collateralRatio: string
        status: Status
    }>()

    return (
        <>
            {!!liquidateVault && (
                <LiquidateVaultModal onClose={() => setLiquidateVault(undefined)} {...liquidateVault} />
            )}
            <Container>
                <Header>
                    <BrandedTitle textContent="ALL VAULTS" $fontSize={isLargerThanSmall ? '3rem' : '2.4rem'} />
                    <CenteredFlex $column={!isLargerThanSmall} $gap={24}>
                        <CheckboxButton checked={filterEmpty} toggle={() => setFilterEmpty((e) => !e)}>
                            Hide Empty Vaults
                        </CheckboxButton>
                        <CollateralDropdown
                            label="Collateral"
                            selectedAsset={collateralFilter}
                            onSelect={setCollateralFilter}
                        />
                        {!isLargerThanSmall && (
                            <SortByDropdown headers={headers} sorting={sorting} setSorting={setSorting} />
                        )}
                    </CenteredFlex>
                </Header>
                <Table
                    container={StyledTableContainer}
                    headers={headers}
                    headerContainer={TableHeader}
                    sorting={sorting}
                    setSorting={setSorting}
                    loading={loading}
                    error={error?.message}
                    isEmpty={!rows.length}
                    rows={rows
                        .slice(RECORDS_PER_PAGE * offset, RECORDS_PER_PAGE * (offset + 1))
                        .map(({ safeId, owner, collateral, debt, collateralRatio, collateralToken, status }) => {
                            const { liquidationCRatio } =
                                liquidationData?.collateralLiquidationData[collateralToken] || {}
                            return (
                                <Table.Row
                                    key={safeId}
                                    container={TableRow}
                                    headers={headers}
                                    items={[
                                        {
                                            // content: <Text>#{safeId}</Text>,
                                            content: (
                                                <Link href={`/vaults/${safeId}`}>
                                                    <CenteredFlex $gap={4}>
                                                        <Text>#{safeId}</Text>
                                                        <HaiArrow direction="upRight" size={14} strokeWidth={1.5} />
                                                    </CenteredFlex>
                                                </Link>
                                            ),
                                        },
                                        {
                                            content: <AddressLink address={owner.address} isOwner />,
                                        },
                                        {
                                            content: isLargerThanSmall ? (
                                                <Grid $columns="1fr 24px 48px" $align="center" $gap={8}>
                                                    <Text $textAlign="right">
                                                        {formatNumberWithStyle(collateral, {
                                                            maxDecimals: 4,
                                                        })}
                                                    </Text>
                                                    <TokenArray tokens={[collateralToken as any]} hideLabel size={24} />
                                                    <Text>{collateralToken}</Text>
                                                </Grid>
                                            ) : (
                                                <Flex $justify="flex-start" $align="center" $gap={8}>
                                                    <Text $textAlign="right">
                                                        {formatNumberWithStyle(collateral, {
                                                            maxDecimals: 4,
                                                        })}
                                                    </Text>
                                                    <TokenArray tokens={[collateralToken as any]} hideLabel size={24} />
                                                    <Text>{collateralToken}</Text>
                                                </Flex>
                                            ),
                                        },
                                        {
                                            content: isLargerThanSmall ? (
                                                <Grid $columns="1fr 24px" $gap={8}>
                                                    <Text $textAlign="right">
                                                        {formatNumberWithStyle(debt, {
                                                            maxDecimals: 4,
                                                        })}
                                                    </Text>
                                                    <Text>HAI</Text>
                                                </Grid>
                                            ) : (
                                                <Flex $justify="flex-start" $align="center" $gap={8}>
                                                    <Text $textAlign="right">
                                                        {formatNumberWithStyle(debt, {
                                                            maxDecimals: 4,
                                                        })}
                                                    </Text>
                                                    <Text>HAI</Text>
                                                </Flex>
                                            ),
                                        },
                                        {
                                            content: (
                                                <Flex $justify="center" $align="center" $gap={12}>
                                                    <Text>
                                                        {collateralRatio === Infinity.toString()
                                                            ? '--'
                                                            : formatNumberWithStyle(collateralRatio, {
                                                                  style: 'percent',
                                                                  scalingFactor: 0.01,
                                                              })}
                                                    </Text>
                                                    <StatusLabel status={status} size={0.8} />
                                                </Flex>
                                            ),
                                        },
                                        {
                                            content: (
                                                <TableButton
                                                    disabled={
                                                        !liquidationCRatio ||
                                                        100 * Number(liquidationCRatio) < Number(collateralRatio)
                                                    }
                                                    onClick={() =>
                                                        setLiquidateVault({
                                                            id: safeId,
                                                            collateralRatio,
                                                            status,
                                                        })
                                                    }
                                                >
                                                    Liquidate
                                                </TableButton>
                                            ),
                                            unwrapped: true,
                                        },
                                    ]}
                                />
                            )
                        })}
                    footer={
                        <Pagination
                            totalItems={rows.length}
                            perPage={RECORDS_PER_PAGE}
                            handlePagingMargin={setOffset}
                        />
                    }
                />
            </Container>
        </>
    )
}

const Container = styled(BlurContainer)`
    width: 100%;
    margin-bottom: 48px;
    & > * {
        padding: 0px;
    }
`

const Header = styled(Flex).attrs((props) => ({
    $width: '100%',
    $justify: 'space-between',
    $align: 'center',
    $gap: 24,
    ...props,
}))`
    position: relative;
    padding: 48px;
    border-bottom: ${({ theme }) => theme.border.medium};

    ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-direction: column;
        padding: 24px;
        & > * {
            width: 100%;
            &:nth-child(2) {
                gap: 12px;
                & > * {
                    width: 100%;
                    &:nth-child(1) {
                        z-index: 5;
                    }
                    &:nth-child(2) {
                        z-index: 4;
                    }
                    &:nth-child(3) {
                        z-index: 3;
                    }
                    &:nth-child(4) {
                        z-index: 2;
                    }
                    &:nth-child(5) {
                        z-index: 1;
                    }
                }
            }
        }
    `}

    z-index: 1;
`

const StyledTableContainer = styled(TableContainer)`
    padding: 48px;
    padding-top: 24px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 0px;
    `}
`
const TableHeaderBase = styled(Grid)`
    grid-template-columns: 80px 120px 180px 180px 1fr 120px;
    align-items: center;
    grid-gap: 12px;
    padding: 8px 16px;
    font-size: 0.8rem;

    & > * {
        padding: 0 4px;
    }
`
const TableHeader = styled(TableHeaderBase)`
    & > *:nth-child(3),
    & > *:nth-child(4),
    & > *:nth-child(5) {
        width: 100%;
    }
`
const TableRow = styled(TableHeaderBase)`
    border-radius: 999px;
    padding: 0px;
    padding-left: 16px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 24px;
        grid-template-columns: 1fr 1fr;
        grid-gap: 12px;
        border-radius: 0px;
        border-bottom: ${theme.border.medium};
        &:hover {
            background-color: unset;
        }
        & > * > * {
            justify-content: flex-start;
        }
    `}
`
