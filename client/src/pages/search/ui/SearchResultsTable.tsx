import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Tabs,
  Tab,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Divider,
  Tooltip,
} from '@mui/material'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { useTranslation } from 'react-i18next'

export type SearchInventory = {
  id: string
  title: string
  description: string
  category: string
  isPublic: boolean
  updatedAt: string
  ownerName: string
  tags: string[]
}

export type SearchItem = {
  id: string
  inventoryId: string
  customId: string
  updatedAt: string
  inventory: { id: string; title: string }
}

export type SearchResponse = {
  inventories: SearchInventory[]
  items: SearchItem[]
  tags: { id: string; name: string }[]
}

type TabKey = 'inventories' | 'items'

type Props = {
  query: string
  inventories: SearchInventory[]
  items: SearchItem[]
}

export default function SearchResultsTable({ query, inventories, items }: Props) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabKey>('inventories')
  const { t } = useTranslation('common')

  const invCount = inventories.length
  const itemCount = items.length

  const header = useMemo(() => {
    const total = invCount + itemCount
    return { total }
  }, [invCount, itemCount])

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack spacing={0.2}>
          <Typography variant="h6" fontWeight={800}>
            {t('search.results')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('search.resultsFor', { count: header.total, query })}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
          icon={<Inventory2RoundedIcon />}
          label={t('search.inventoriesCount', { count: invCount })}
          variant="outlined"
          sx={(theme) => ({
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          })}
          />
          <Chip
          icon={<ListAltRoundedIcon />}
          label={t('search.itemsCount', { count: itemCount })}
          variant="outlined"
          sx={(theme) => ({
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.secondary.main, 0.04),
          })}
          />
          </Stack>
      </Stack>

      <Divider />

      <Tabs
      value={tab}
      onChange={(_, v: TabKey) => setTab(v)}
      variant="scrollable"
      allowScrollButtonsMobile
      sx={(theme) => ({
        minHeight: 44,
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTab-root': {
          minHeight: 38,
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 999,
          px: 2,
          mr: 1,
          color: theme.palette.text.secondary,
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          transition: 'all .2s ease',
        },
        '& .MuiTab-root.Mui-selected': {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.18),
        },
        })}
        ></Tabs>

      {tab === 'inventories' ? (
        invCount === 0 ? (
          <EmptyState
            title={t('search.noInventoriesFound')}
            subtitle={t('search.tryDifferentQuery')}
          />
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>{t('table.title')}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('table.category')}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('table.owner')}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('search.access')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {inventories.map((inv) => (
                  <TableRow
                    key={inv.id}
                    hover
                    sx={(theme) => ({
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    })}
                    onClick={() => navigate(`/inventories/${inv.id}`)}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={750}>{inv.title}</Typography>
                        <Tooltip title={t('actions.open')}>
                          <OpenInNewRoundedIcon fontSize="small" />
                        </Tooltip>
                      </Stack>

                      {inv.description ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {inv.description}
                        </Typography>
                      ) : null}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={inv.category ?? '—'}
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {inv.ownerName ?? '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={inv.isPublic ? t('search.public') : t('search.restricted')}
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )
      ) : itemCount === 0 ? (
        <EmptyState
          title={t('search.noItemsFound')}
          subtitle={t('search.tryCustomIdOrInventory')}
        />
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>{t('search.customId')}</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>{t('item.inventoryLabel')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((it) => (
                <TableRow
                  key={it.id}
                  hover
                  sx={(theme) => ({
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  })}
                  onClick={() => navigate(`/inventories/${it.inventoryId}/items/${it.id}`)}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={800}>{it.customId}</Typography>
                      <Tooltip title={t('actions.open')}>
                        <OpenInNewRoundedIcon fontSize="small" />
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {it.inventory?.title ?? '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {t('search.tip')}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Stack
      spacing={0.6}
      sx={(theme) => ({
        borderRadius: 2,
        border: `1px dashed ${theme.palette.divider}`,
        p: 3,
        backgroundColor: alpha(theme.palette.background.default, 0.6),
      })}
    >
      <Typography fontWeight={800}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Stack>
  )
}