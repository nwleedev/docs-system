---
title: docs/dev Guidance Boundary Research
date: 2026-06-19
status: draft
---

# docs/dev Guidance Boundary Research

## Summary

`docs/dev/_templates`는 여러 레포에서 개발 컨벤션과 개발 지침 문서 구조를 세팅하는 템플릿 역할에 집중해야 한다. 실제로 어떤 개발 관심사를 조사하고 문서화할지는 `examples/`의 프롬프트 파일 또는 별도 실행 입력이 책임져야 한다.

## Problem Frame

현재 `docs/dev/_commands`는 이름과 위치 때문에 실제 실행 가능한 명령처럼 보일 수 있지만, 내용상으로는 재사용 프롬프트와 런북이다. 소비 레포에서 작동하지 않는 문제가 발생했다면, `_commands`를 더 강화하는 것보다 "실행 도구가 아님"을 명확히 하거나 위치와 명명을 조정하는 편이 더 안전하다.

`docs/dev/_templates`는 문서 작성 책임까지 일부 떠안으면서 복잡도가 커졌다. 템플릿이 모든 기술스택 관심사를 포함하면 레포마다 다른 스택 차이를 흡수하지 못하고, 결국 특정 예시 스택이 기본값처럼 보이는 리스크가 생긴다.

## Scope Preservation

| Request Phrase | Coverage Obligation | Forbidden Narrowing | Completion Proof |
| --- | --- | --- | --- |
| `여러 기술스택에 대해서 ... 리서치+교차검증` | 외부 문서 원칙과 로컬 파일 증거를 함께 검토한다. | 로컬 감상만 기록한다. | `research/0001-template-command-example-boundaries.md`의 Evidence와 Cross-Validation. |
| `docs/dev/README.md ... 리스크` | 루트 거버넌스 README의 잠재 리스크를 별도로 식별한다. | `_templates`만 검토한다. | 리서치 기록의 README Risk Assessment. |
| `_template.md 뿐만 아니라 README.md 파일까지 존재` | `_templates/README.md`, folder README, body template의 책임을 분리해 검토한다. | `_template.md`만 개선 대상으로 본다. | `research/0003-readme-template-system-improvements.md`의 Layered Improvement Model. |
| `추가 파일이 아니라 README.md 파일을 강화` | 별도 prohibition 파일 없이 README 내부 guardrail 강화가 가능한지 검토한다. | 별도 파일 추가안만 검토한다. | `research/0004-readme-authoring-guardrails.md`의 README-Only Option. |
| `기존 코드를 믿을 수 없기 때문에 깃허브 내 여러 레포를 리서치` | 로컬 코드가 있어도 외부 레포 교차검증을 개발 지침 작성의 기본 게이트로 검토한다. | 기존 코드가 있으면 외부 sampling을 생략한다. | `research/0005-external-repository-cross-validation.md`의 External Repository Cross-Validation Model. |
| `examples 폴더 내 프롬프트 파일이 책임` | 템플릿, 명령, 예시 프롬프트의 책임 경계를 비교한다. | `_commands` 유지 여부만 논한다. | 리서치 기록의 Options와 Recommendation. |
| `각 세부 관심사에 대해서 여러 예시까지 작성` | 실제 개발 지침 문서가 세부 관심사별 best/anti 비교 예시를 요구하도록 연구한다. | 코드 예시가 낡을 수 있다는 이유로 예시를 제거한다. | `research/0002-pattern-example-coverage.md`의 Example Coverage Contract. |
| `리서치 문서를 작성` | Git 추적 가능한 설계 패키지 리서치 문서를 추가한다. | 채팅 답변으로만 결론을 남긴다. | 이 패키지의 `requirements.md`와 `research/**`. |
| `_commands를 지금 삭제하는 방향으로 결정` | 삭제 결정을 뒷받침하는 추가 리스크, 대체 책임, 이전 결정 supersession, 구현 전 체크리스트를 검토한다. | 단순히 폴더를 지우는 파일 작업으로만 본다. | `research/0006-remove-commands-decision.md`의 removal readiness checklist. |
| `examples 폴더 네이밍을 "prohibitions"으로 변경` | AI에게 기술스택별 "하면 안 되는 것"을 명확히 전달하는 네이밍이 적합한지 검토한다. | 폴더명 선호만 비교한다. | `research/0007-examples-vs-prohibitions-naming.md`의 naming options와 recommendation. |
| `examples의 파일은 자유 형식으로 작성 + 최상단에 공통 지침만 배치` | `examples/` 파일을 엄격한 섹션 템플릿으로 만들지 않고, 공통 지침만 상단에 두는 방식을 반영한다. | 모든 example prompt에 동일한 상세 섹션 구조를 강제한다. | `research/0007-examples-vs-prohibitions-naming.md`의 revised recommendation과 `plan.md` U11. |

## Requirements

- R1. 현재 `docs/dev/README.md`, `docs/dev/_templates/**`, `docs/dev/_commands/**`, `examples/**`의 책임 경계를 로컬 증거로 검토한다.
- R2. 문서 구조 원칙은 공식 문서, 표준적 문서 프레임워크, 또는 널리 쓰이는 문서 관리 자료로 교차검증한다.
- R3. `docs/dev/README.md`의 잠재 리스크를 별도 항목으로 기록한다.
- R4. 선택지는 최소 3개 이상 제시하고 장단점과 권장안을 기록한다.
- R5. 구현 변경은 포함하지 않고, 구조 변경 전 의사결정에 필요한 리서치 문서만 작성한다.
- R6. 실제 개발 지침 문서 작성 시 세부 관심사별로 여러 best/anti pattern 예시를 요구하는 방법을 리서치+교차검증한다.
- R7. 코드 예시가 낡을 수 있는 리스크와, 예시가 없을 때 코드가 임의로 작성되는 리스크를 함께 비교한다.
- R8. Codex가 어떤 코드를 작성해야 하는지 직관적으로 비교할 수 있도록 예시 작성 단위, 비교 형식, 검증 기준을 기록한다.
- R9. `docs/dev/README.md`와 `docs/dev/_templates` 시스템을 함께 개선하는 방향을 리서치+교차검증한다.
- R10. `_templates` 안의 root README, folder README, `_template.md`, `_bootstrap-audit.md`를 각각 별도 개선 대상으로 분리해 검토한다.
- R11. 개선 방향은 여러 기술스택과 여러 레포에 적용 가능한 구조여야 하며, 특정 스택 관심사를 템플릿 기본값으로 넣지 않아야 한다.
- R12. 별도 prohibition 파일을 추가하지 않고 `docs/dev/README.md`를 강화하는 선택지를 리서치+교차검증한다.
- R13. README 강화안은 금지사항 가시성, README 비대화, `docs/dev/ai`와의 책임 중복 리스크를 함께 평가해야 한다.
- R14. 기존 로컬 코드가 존재하더라도 개발 지침 작성 시 외부 GitHub 레포 교차검증을 요구하는 방향을 리서치+교차검증한다.
- R15. 로컬 코드는 current-state evidence일 뿐 best-practice authority가 아니라는 규칙을 README 개선안에 반영한다.
- R16. README의 `Stack-Only Repository Sampling`을 `External Repository Cross-Validation`로 확장하거나 대체하는 설계 방향을 기록한다.
- R17. `_commands` 삭제 결정이 기존 설계 기록과 충돌하는 지점을 식별하고 supersession이 필요한지 검토한다.
- R18. `_commands` 삭제 후 각 command 파일의 기존 책임이 README, `_templates`, `examples`, `repository`, audit 문서 중 어디로 이동해야 하는지 기록한다.
- R19. 삭제 구현 전 제거해야 할 live reference, 유지해도 되는 historical reference, 검증 검색어를 기록한다.
- R20. `examples/` 폴더를 `prohibitions/`로 바꾸는 네이밍 선택지를 리서치+교차검증한다.
- R21. 금지 중심 네이밍이 AI에게 주는 장점과, best pattern·외부 리서치·예시 작성 책임을 좁히는 리스크를 함께 기록한다.
- R22. 폴더명을 바꾸지 않더라도 각 기술스택 프롬프트에서 "하지 말아야 할 것"을 명확히 전달하는 대안을 기록한다.
- R23. `examples/` 파일은 자유 형식으로 작성할 수 있어야 하며, 공통 요구는 최상단 지침으로만 제공하고 상세 섹션 구조를 강제하지 않아야 한다.

## Required Artifacts And Persistence

| Artifact | Required For | Expected Persistence | Completion Proof | Decision Needed |
| --- | --- | --- | --- | --- |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/requirements.md` | R1-R5 | Tracked | Git 상태에서 신규 파일로 확인된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/README.md` | R1-R5 | Tracked | 리서치 인덱스가 존재한다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0001-template-command-example-boundaries.md` | R1-R5 | Tracked | 로컬/외부 증거, 교차검증, 선택지, 권장안이 기록된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0002-pattern-example-coverage.md` | R6-R8 | Tracked | 세부 관심사별 예시 커버리지 계약과 stale mitigation이 기록된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0003-readme-template-system-improvements.md` | R9-R11 | Tracked | README와 template 계층별 개선 모델이 기록된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0004-readme-authoring-guardrails.md` | R12-R13 | Tracked | README-only guardrail 강화안과 한계가 기록된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0005-external-repository-cross-validation.md` | R14-R16 | Tracked | 기존 코드가 있어도 외부 레포 교차검증을 요구하는 README 개선 모델이 기록된다. | None |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0006-remove-commands-decision.md` | R17-R19 | Tracked | `_commands` 삭제의 대체 책임, supersession, 링크 영향, 검증 기준이 기록된다. | Needed for implementation |
| `docs/designs/docs-dev-guidance-boundary-20260619-k4p9/research/0007-examples-vs-prohibitions-naming.md` | R20-R23 | Tracked | `examples`와 `prohibitions` 네이밍의 장단점, 자유 형식 작성 대안, 권장안이 기록된다. | Needed if renaming |

## Scope Boundaries

**Out Of Scope**

- `docs/dev` 구조 직접 변경.
- `_commands` 삭제, 이동, 이름 변경 구현.
- `examples/` 폴더 이름 변경 또는 프롬프트 추가/수정.
- 소비 레포에서의 실제 실행 검증.
- 실제 기술스택별 개발 지침 본문 작성.

## Sources

- User request on 2026-06-19: structure-change research and documentation scope.
- `docs/dev/README.md`: current portable governance.
- `docs/dev/_templates/**`: current template responsibility.
- `docs/dev/_commands/**`: current prompt/runbook responsibility.
- `examples/nextjs-frontend.md`: current stack-specific prompt example.
