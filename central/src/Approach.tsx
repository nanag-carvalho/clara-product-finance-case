import { Alert, AlertTitle, AlertDescription, Stack } from '@/design-system'

export default function Approach() {
  return (
    <Stack gap={24}>
      <section id="approach-direction" className="prose">
        <h2>The proposal</h2>
        <p>
          Initiate a supplier Pix in Clara using funds held at an external bank.
          Choose the source within the payment task, connect it when needed and
          keep the request traceable through company approval and payment
          confirmation.
        </p>
        <table>
          <thead>
            <tr>
              <th>Decision</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Choose the debit account in context</td>
              <td>
                A1 · Removes a separate funding task and makes the money source
                explicit.
              </td>
            </tr>
            <tr>
              <td>Preserve company approval</td>
              <td>
                A3 · Faster preparation must retain the company's decision
                rules.
              </td>
            </tr>
            <tr>
              <td>Review recipient, amount and source together</td>
              <td>
                A4/A6 · Related editing actions support correction before
                commitment.
              </td>
            </tr>
            <tr>
              <td>Recover using the same request</td>
              <td>
                A2/A5 · An uncertain response requires checking its outcome
                before another submission.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="approach-dependencies" className="prose">
        <h2>One request, different responsibilities</h2>
        <p>
          First use links the account and device. A valid existing connection
          skips setup. Company approval and payment authorization remain
          separate decisions.
        </p>
        <ol className="case-responsibility-list">
          <li>
            <strong>Prepare and review · Requester</strong>
            <p>
              Check the recipient, amount and debit account; save the request
              for the company decision.
            </p>
          </li>
          <li>
            <strong>Apply the policy · Company approver or rule</strong>
            <p>
              The prototype illustrates one manual review. Automatic approval
              and multiple layers are policy cases outside this simulation.
            </p>
          </li>
          <li>
            <strong>Authorize · Authorized representative</strong>
            <p>
              Confirm the approved Pix using the linked device's security method
              in Clara.
            </p>
          </li>
          <li>
            <strong>Confirm the outcome · Payment service</strong>
            <p>
              Show a receipt after confirmed success, a remedy after confirmed
              failure, or a same-request status check while the outcome is
              unknown.
            </p>
          </li>
        </ol>
        <Alert variant="note">
          <AlertTitle>Feasibility dependency</AlertTitle>
          <AlertDescription>
            Account linking includes bank confirmation. Subsequent authorization
            in Clara depends on provider support, PJ eligibility, signatory
            rules and device binding. These are dependencies, not established
            integration capabilities.
          </AlertDescription>
        </Alert>
      </section>
    </Stack>
  )
}
