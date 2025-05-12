import styled from 'styled-components'

const Labels = styled.label`
  padding: 10px 16px;
  font-weight: 600;
  font-size: 20px;
  color: var(--ba-text-black);

  ${({ invalid }) => {
    if (invalid) return `color: var(--ba-text-red)`
  }}
`

export default Labels
