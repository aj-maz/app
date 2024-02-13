import { useState } from 'react'

import type { SetState } from '~/types'
import {
    ChainId,
    LINK_TO_DISCORD,
    LINK_TO_DOCS,
    LINK_TO_GOVERNANCE,
    LINK_TO_PRIVACY_POLICY,
    LINK_TO_TELEGRAM,
    LINK_TO_TWITTER,
    NETWORK_ID,
} from '~/utils'
import { useMediaQuery, useOutsideClick } from '~/hooks'

import styled from 'styled-components'
import { CenteredFlex, Flex, HaiButton, Popout } from '~/styles'
import { Hamburger } from '~/components/Icons/Hamburger'
import { ConnectButton } from '~/components/ConnectButton'
import { BrandedDropdown } from '~/components/BrandedDropdown'
import {
    BarChart,
    Clipboard,
    Database,
    Download,
    EyeOff,
    File,
    FileText,
    Grid,
    Repeat,
    Search,
    ShoppingBag,
    TrendingUp,
} from 'react-feather'
import { Twitter } from '~/components/Icons/Twitter'
import { Telegram } from '~/components/Icons/Telegram'
import { Discord } from '~/components/Icons/Discord'
import { Caret } from '~/components/Icons/Caret'

type MobileMenuProps = {
    active: boolean
    setActive: SetState<boolean>
    showWrapEth: () => void
}
export function MobileMenu({ active, setActive, showWrapEth }: MobileMenuProps) {
    const isLargerThanSmall = useMediaQuery('upToSmall')
    const isLargerThanMedium = useMediaQuery('upToMedium')
    const isLargerThanLarge = useMediaQuery('upToLarge')

    const [button, setButton] = useState<HTMLElement | null>(null)

    useOutsideClick(button, () => setActive(false))

    return (
        <DropdownButton
            as="div"
            $variant={isLargerThanSmall ? undefined : 'yellowish'}
            ref={setButton}
            onClick={() => setActive((a) => !a)}
        >
            {!isLargerThanSmall ? (
                <Hamburger size={20} />
            ) : (
                <CenteredFlex $gap={12}>
                    {!isLargerThanMedium ? 'Menu' : 'More'}
                    <IconContainer $rotate={active}>
                        <Caret direction="down" />
                    </IconContainer>
                </CenteredFlex>
            )}
            {active && (
                <Dropdown $float="left" $margin="20px">
                    <Inner>
                        {!isLargerThanSmall && <ConnectButton $width="100%" showBalance="vertical" />}
                        {!isLargerThanMedium && (
                            <>
                                <BrandedDropdown.Item
                                    href="/vaults"
                                    icon={<Database size={18} />}
                                    active={location.pathname.startsWith('/vaults')}
                                >
                                    Get HAI
                                </BrandedDropdown.Item>
                                <BrandedDropdown.Item
                                    href="/earn"
                                    icon={<TrendingUp size={18} />}
                                    active={location.pathname === '/earn'}
                                >
                                    Earn
                                </BrandedDropdown.Item>
                            </>
                        )}
                        {!isLargerThanLarge && (
                            <BrandedDropdown.Item
                                href="/learn"
                                icon={<Grid size={18} />}
                                active={location.pathname === '/learn'}
                            >
                                Learn
                            </BrandedDropdown.Item>
                        )}
                        <BrandedDropdown.Item
                            href="/auctions"
                            icon={<ShoppingBag size={18} />}
                            active={location.pathname === '/auctions'}
                        >
                            Auctions
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href="/analytics"
                            icon={<BarChart size={18} />}
                            active={location.pathname === '/analytics'}
                        >
                            Analytics
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href="/contracts"
                            icon={<File size={18} />}
                            active={location.pathname === '/contracts'}
                        >
                            Contracts
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href="/vaults/explore"
                            icon={<Search size={18} />}
                            active={location.pathname === '/vaults/explore'}
                        >
                            Vault Explorer
                        </BrandedDropdown.Item>
                        {NETWORK_ID === ChainId.OPTIMISM_SEPOLIA && (
                            <BrandedDropdown.Item
                                href="/test/claim"
                                icon={<Download size={18} />}
                                active={location.pathname === '/test/claim'}
                            >
                                Claim Test Tokens
                            </BrandedDropdown.Item>
                        )}
                        <BrandedDropdown.Item onClick={showWrapEth} icon={<Repeat size={18} />}>
                            Wrap ETH
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item href={LINK_TO_DOCS} icon={<FileText size={18} />}>
                            Docs
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item href={LINK_TO_GOVERNANCE} icon={<Clipboard size={18} />}>
                            Governance
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item href={LINK_TO_PRIVACY_POLICY} icon={<EyeOff size={18} />}>
                            Privacy Policy
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href={LINK_TO_TWITTER}
                            icon={<Twitter size={16} stroke="black" strokeWidth={2} />}
                        >
                            Twitter
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href={LINK_TO_TELEGRAM}
                            icon={<Telegram size={17} stroke="black" strokeWidth={2} />}
                        >
                            Telegram
                        </BrandedDropdown.Item>
                        <BrandedDropdown.Item
                            href={LINK_TO_DISCORD}
                            icon={<Discord size={19} stroke="black" strokeWidth={2} />}
                        >
                            Discord
                        </BrandedDropdown.Item>
                    </Inner>
                </Dropdown>
            )}
        </DropdownButton>
    )
}

const DropdownButton = styled(HaiButton)`
    position: relative;
    height: 48px;
    flex-shrink: 0;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 48px;
        min-width: unset;
        padding: 0px;
        justify-content: center;
    `}
`
const IconContainer = styled(CenteredFlex)<{ $rotate?: boolean }>`
    transition: all 0.5s ease;
    transform: ${({ $rotate }) => ($rotate ? 'rotate(-180deg)' : 'rotate(0deg)')};
`
const Dropdown = styled(Popout)`
    width: fit-content;
    justify-content: flex-start;
    margin-right: -16px;
    gap: 4px;
    cursor: default;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-right: -19px;
    `}
    padding: 32px 0;
`
const Inner = styled(Flex).attrs((props) => ({
    $column: true,
    $justify: 'flex-start',
    $align: 'flex-start',
    $gap: 12,
    ...props,
}))`
    width: fit-content;
    padding: 12px;
    max-height: calc(100vh - 300px);
    overflow: hidden auto;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    & > * {
        width: 100%;
        text-decoration: none;
    }

    ${({ theme }) => theme.mediaWidth.upToMedium`
        gap: 6px;
    `}
`
