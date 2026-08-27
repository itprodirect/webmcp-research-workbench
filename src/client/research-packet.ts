import type { SourceDetailsRecord } from "../domain/source-record";

export function addSourceToPacket(
  packet: SourceDetailsRecord[],
  source: SourceDetailsRecord,
): SourceDetailsRecord[] {
  if (packet.some((member) => member.id === source.id)) {
    return packet;
  }
  return [...packet, source];
}

export function removeSourceFromPacket(
  packet: SourceDetailsRecord[],
  sourceId: string,
): SourceDetailsRecord[] {
  return packet.filter((member) => member.id !== sourceId);
}
