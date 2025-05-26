//
const { ObjectId } = require('mongoose').Types;
const { Cruds } = require('src/common/handlers');
const allServices = require('src/modules/services');
const TeamModel = require('./team.model');

let userService;
class TeamService extends Cruds {
  async createTeam(params) {
    const teamCreated = await this.create(params);
    await userService.update({
      _id: {
        $in: params.members,
      },
    }, {
      memberTeamId: teamCreated._id,
    });
    const team = await this.findById(teamCreated._id, {}, true, [{
      path: 'managerId',
      select: 'firstName lastName email',
    }, {
      path: 'members',
      select: 'firstName lastName email',
    }]);
    return team;
  }

  async addTeamMember(teamId, members) {
    const res = await Promise.all([
      this.Model.update({ _id: ObjectId(teamId) }, {
        $push: {
          members,
        },
      }),
      userService.Model.updateMany({ _id: { $in: members.map((obj) => ObjectId(obj)) } }, {
        $set: { memberTeamId: teamId },
      }),

    ]);
    return res[0];
  }

  async removeTeamMember(teamId, members) {
    const res = await Promise.all([
      this.Model.update({ _id: ObjectId(teamId) }, {
        $pullAll: {
          members,
        },
      }),
      userService.Model.updateMany({ _id: { $in: members.map((obj) => ObjectId(obj)) } }, {
        $set: { memberTeamId: null },
      }),

    ]);
    return res[0];
  }

  async deleteTeam(teamId) {
    const res = await Promise.all([
      this.findById(teamId),
      this.deleteById(teamId),
    ]);
    if (res[0] && res[0].members) {
      await userService.Model.updateMany({ _id: { $in: res[0].members } }, {
        $set: { memberTeamId: null },
      });
    }
    const team = await this.deleteById(teamId);
    return team;
  }
}

module.exports = new TeamService(TeamModel.Model, TeamModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  userService = services.userService;
}, 0);