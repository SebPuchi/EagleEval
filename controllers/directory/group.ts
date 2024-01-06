import { IProfessor } from '../../models/professor';
import { updateProf } from '../syncProfs';

class Group {
  private name: string;
  private members: IProfessor[];
  private subgroups: Group[];

  constructor(
    name: string,
    members: IProfessor[] = [],
    subgroups: Group[] = []
  ) {
    this.name = name;
    this.members = members;
    this.subgroups = subgroups;
  }

  // Getter and setter methods for name
  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  // Getter and setter methods for members
  getMembers(): IProfessor[] {
    return this.members;
  }

  setMembers(members: IProfessor[]): void {
    this.members = members;
  }

  addMember(member: IProfessor): void {
    this.members.push(member);
  }

  // Getter and setter methods for subgroups
  getSubgroups(): Group[] {
    return this.subgroups;
  }

  setSubgroups(subgroups: Group[]): void {
    this.subgroups = subgroups;
  }

  addSubgroup(subgroup: Group): void {
    this.subgroups.push(subgroup);
  }

  print(depth: number = 0): void {
    const indentation = '  |'.repeat(depth);
    //const branchSymbol = depth === 0 ? '' : ' '; // Add a vertical bar and double dash for non-root nodes
    console.log(`${indentation.slice(0, -1)}${this.name}`);

    for (const member of this.members) {
      console.log(`${indentation}  |-- ${member.name}`);
    }

    for (const subgroup of this.subgroups) {
      subgroup.print(depth + 1);
    }
  }

  // Recursive function to call async function on all IProfessor members and resolve promises
  async updateMongo(): Promise<void> {
    // Call the async function on each IProfessor member and store the promises
    const promises = this.members.map((member) => updateProf(member));

    // Recursively call the function on subgroups and merge their promises
    const subgroupPromises = this.subgroups.map((subgroup) =>
      subgroup.updateMongo()
    );

    const allPromises = promises.concat(subgroupPromises);

    // Resolve all promises using Promise.all
    await Promise.all(allPromises);
  }
}

export default Group;
