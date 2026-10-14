import {
  Badge,
  Button,
  Label,
  Pressable,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Stack,
} from '@/design-system'
import type { Outcome } from './flow-model'
import { scenarioOptions, scenarioCategory } from './scenarios'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkspace: (data: 'empty' | 'populated') => void
  onScenario: (option: (typeof scenarioOptions)[number]) => void
  onPixExample: () => void
  outcome: Outcome
  onOutcomeChange: (outcome: Outcome) => void
}
/** Demo controls are separate from the financial task. Callbacks reuse ordinary workspace transitions. */
export function ScenarioExplorer({
  open,
  onOpenChange,
  onWorkspace,
  onScenario,
  onPixExample,
  outcome,
  onOutcomeChange,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="proto-scenario-sheet">
        <SheetHeader>
          <SheetTitle>Explore the prototype</SheetTitle>
          <SheetDescription>
            Choose a workspace or open a scenario. All payments and responses
            are simulated.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="proto-test-scroll">
          <Stack gap={24}>
            <section>
              <h3 className="type-h3">Workspace views</h3>
              <div className="proto-scenario-workspaces">
                <Button
                  variant="outline"
                  onClick={() => {
                    onWorkspace('populated')
                  }}
                >
                  View populated workspace
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onWorkspace('empty')
                  }}
                >
                  View empty workspace
                </Button>
              </div>
            </section>
            {[
              {
                title: 'Prepare and pay',
                ids: ['first', 'ready', 'authorization', 'paid'],
              },
              { title: 'Company decision', ids: ['approval', 'rejected'] },
              {
                title: 'Interruption and recovery',
                ids: [
                  'canceled',
                  'expired',
                  'balance',
                  'limit',
                  'unavailable',
                  'unknown',
                ],
              },
            ].map((group) => (
              <section key={group.title}>
                <Stack gap={8}>
                  <h3 className="type-h3">{group.title}</h3>
                  {scenarioOptions
                    .filter((option) => group.ids.includes(option.id))
                    .map((option) => (
                      <Pressable
                        className="proto-scenario-option"
                        key={option.id}
                        onClick={() => onScenario(option)}
                      >
                        <div>
                          <strong>{option.title}</strong>
                          <Badge
                            variant="outline"
                            className={scenarioCategory(option.id).tone}
                          >
                            {scenarioCategory(option.id).label}
                          </Badge>
                          <Badge variant="outline">{option.hypothesis}</Badge>
                        </div>
                        <p className="type-ui">{option.observe}</p>
                        <span className="type-caption">Open scenario →</span>
                      </Pressable>
                    ))}
                  {group.title === 'Prepare and pay' && (
                    <Pressable
                      className="proto-scenario-option"
                      onClick={() => {
                        onPixExample()
                      }}
                    >
                      <div>
                        <strong>Pix Copia e Cola</strong>
                        <Badge variant="outline" className="status-success">
                          Happy path
                        </Badge>
                        <Badge variant="outline">H1 · H4</Badge>
                      </div>
                      <p className="type-ui">
                        Recognize a payment code, confirm its recipient and
                        retain the charge amount.
                      </p>
                      <span className="type-caption">Open scenario →</span>
                    </Pressable>
                  )}
                </Stack>
              </section>
            ))}
            <details className="proto-simulation-settings">
              <summary>Simulation settings</summary>
              <Stack gap={8}>
                <Label htmlFor="scenario-outcome">Next service response</Label>
                <p className="type-caption">
                  Applies after authorization or a status check. It does not
                  change the current result.
                </p>
                <Select
                  value={outcome}
                  onValueChange={(v) => onOutcomeChange(v as Outcome)}
                >
                  <SelectTrigger id="scenario-outcome">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Confirmed success</SelectItem>
                    <SelectItem value="failed">Confirmed failure</SelectItem>
                    <SelectItem value="unknown">
                      Result still unknown
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Stack>
            </details>
          </Stack>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
