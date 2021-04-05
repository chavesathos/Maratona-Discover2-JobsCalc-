const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    let statusCount = {
        progress: 0,
        done: 0,
        total: jobs.length 
    }

    //Total de horas por dia de cada Job em progresso
    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      //Somando a quantidade de status
      statusCount[status] += 1;  // += somar o conteudo da variavel e guardar na mesma variavel ! 

      //Total de horas livres no dia
      jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
      
      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    //Quantidade de horas que quero trabalhar dia (PROFILE) MENOS quantidade de horas/dia de cada job em propgress
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours });
  },
};