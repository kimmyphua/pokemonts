export async function fetchGraphQL(
  query: string,
  variables: any,
  operationName: string
) {
  const result = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    body: JSON.stringify({
      query: query,
      variables: variables,
      operationName: operationName
    })
  })

  const { errors, data } = await result.json()
  return { errors, data }
}
