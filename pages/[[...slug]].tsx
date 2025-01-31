import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { toStandard } from '../utils/text'
import { Warscrolls } from '../warscrolls/data'
import { TWarscroll, TWarscrolls } from '../warscrolls/types'
import { Card } from '../components/card'
import { SearchBox } from '../components/search';
import { Footer } from '../components/footer';


const Search: NextPage = () => {

  const router = useRouter()
  const slug = router.query.slug ? router.query.slug[0] : ""
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matches = Object.entries(Warscrolls).reduce((accum, [name, warscroll]) => {
    const otherFields = `${warscroll.faction} || ${warscroll.baseSize} || ${warscroll.notes}`
    if (toStandard(name).includes(standardisedSlug)) accum['name'][name] = warscroll
    else if (toStandard(otherFields).includes(standardisedSlug)) accum['other'][name] = warscroll
    return accum
  }, {'name': {}, 'other': {}} as {'name': TWarscrolls, 'other': TWarscrolls})
  const warscrolls = { ...matches['name'], ...matches['other']}
  const cardColumnStyle = (Object.keys(warscrolls).length > 1) ? "col-md-6" : "col-12"

  const showSearch = true
  const showFaction = (name: string, warscroll: TWarscroll): boolean => {
    return (slug.length > 0 && toStandard(warscroll.faction).includes(slug) && !toStandard(name).includes(slug))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <title key="title">Base Desires</title>
        <meta name="description" content="What every AoS player really desires: to know what bases everything goes on" key="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container pt-3 flex-fill">
        <h1><Link href={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          { showSearch && <SearchBox /> }
        </div>

        <div className="row">
          {Object.entries(warscrolls).map(([name, warscroll]) =>
            <div className={cardColumnStyle} key={name}>
              <Card name={name} warscroll={warscroll} link={true} showFaction={showFaction(name, warscroll)} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Search
