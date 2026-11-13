import { getIssueById, getIssueBySlug } from '../../data/issues'

// Old numbered addresses (like /issue/207) now forward permanently to the
// name address (like /housing-counselor-short-sale). Both old links and
// shared links keep working, and Google sees one address per issue.
export async function getServerSideProps({ params }) {
  const key = String(params.id)
  const issue = /^\d+$/.test(key) ? getIssueById(key) : getIssueBySlug(key)
  if (!issue || !issue.slug) return { notFound: true }
  return { redirect: { destination: `/${issue.slug}`, permanent: true } }
}

export default function IssueRedirect() {
  return null
}
